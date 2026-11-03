#!/usr/bin/env python3
"""Block personal data from being published on the site.

Checks for:
  - photo metadata (GPS, camera, dates) in JPEG, PNG, and WebP files. With
    KEEP_CREDITS on, artist/credit metadata is allowed and only location,
    serial numbers, and computer file paths are blocked.
  - file types that shouldn't be public (HEIC/RAW photos, PDFs, Office docs,
    keys, .env, .DS_Store, Claude Code config and skills)
  - phone numbers, API keys, and private keys in text files

Usage:
  check_sensitive.py              check files staged for commit (pre-commit hook)
  check_sensitive.py --all        check every tracked file (CI)
  check_sensitive.py --strip F..  remove metadata from the given images in place

To commit something on purpose anyway: git commit --no-verify
"""
import re
import struct
import subprocess
import sys

# Art sites: keep authorship metadata on images so the artist can prove the
# work is theirs. Only metadata that identifies where/who (GPS, device serial,
# file paths with usernames) is blocked.
KEEP_CREDITS = True

BLOCKED_EXT = re.compile(
    r'\.(heic|heif|tiff?|dng|cr2|nef|arw|raw|pdf|docx?|xlsx?|pptx?|key|pem|p12|pfx|env)$', re.I)
BLOCKED_NAME = re.compile(
    r'(^|/)(\.DS_Store|\.env(\..*)?|id_rsa.*|id_ed25519.*|CLAUDE(\.local)?\.md)$|(^|/)\.claude/')
TEXT_EXT = re.compile(r'\.(html?|css|js|json|md|txt|ya?ml|xml|svg)$', re.I)

TEXT_PATTERNS = {
    'phone number': re.compile(r'(?<![\w.-])(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?![\w-])'),
    'private key': re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----'),
    'AWS key': re.compile(r'AKIA[0-9A-Z]{16}'),
    'GitHub token': re.compile(r'gh[pousr]_[A-Za-z0-9]{30,}'),
    'API key': re.compile(r'(sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{35})'),
}

# Metadata segments/chunks that can carry GPS, device, or author info.
JPEG_META = {0xE1: 'EXIF/XMP', 0xED: 'IPTC', 0xFE: 'comment'}
PNG_META = {b'eXIf', b'tEXt', b'zTXt', b'iTXt', b'tIME'}
WEBP_META = {b'EXIF', b'XMP '}


def jpeg_segments(data):
    i = 2
    while i + 4 <= len(data) and data[i] == 0xFF:
        marker = data[i + 1]
        if marker in (0xD9, 0xDA):  # end of image / start of pixel data
            yield None, i
            return
        length = struct.unpack('>H', data[i + 2:i + 4])[0]
        yield marker, (i, i + 2 + length)
        i += 2 + length


def png_chunks(data):
    i = 8
    while i + 8 <= len(data):
        length = struct.unpack('>I', data[i:i + 4])[0]
        yield data[i + 4:i + 8], (i, i + 12 + length)
        i += 12 + length


def webp_chunks(data):
    i = 12
    while i + 8 <= len(data):
        length = struct.unpack('<I', data[i + 4:i + 8])[0]
        end = i + 8 + length + (length & 1)
        yield data[i:i + 4], (i, end)
        i = end


def image_kind(data):
    if data[:2] == b'\xff\xd8':
        return 'jpeg'
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return 'png'
    if data[:4] == b'RIFF' and data[8:12] == b'WEBP':
        return 'webp'
    if data[4:8] == b'ftyp':
        return 'heic'
    return None


def image_metadata(data):
    kind = image_kind(data)
    if kind == 'jpeg':
        return sorted({JPEG_META[m] for m, _ in jpeg_segments(data) if m in JPEG_META})
    if kind == 'png':
        return sorted({t.decode() for t, _ in png_chunks(data) if t in PNG_META})
    if kind == 'webp':
        return sorted({t.decode().strip() for t, _ in webp_chunks(data) if t in WEBP_META})
    if kind == 'heic':
        return ['HEIC container (convert to JPEG)']
    return []


def metadata_payloads(data):
    """Yield ('exif', tiff_bytes) and ('text', bytes) for each metadata block."""
    kind = image_kind(data)
    if kind == 'jpeg':
        for marker, span in jpeg_segments(data):
            if marker in JPEG_META:
                seg = data[span[0] + 4:span[1]]
                if seg.startswith(b'Exif\0\0'):
                    yield 'exif', seg[6:]
                else:
                    yield 'text', seg
    elif kind == 'png':
        for t, (a, b) in png_chunks(data):
            if t in PNG_META:
                yield ('exif' if t == b'eXIf' else 'text'), data[a + 8:b - 4]
    elif kind == 'webp':
        for t, (a, b) in webp_chunks(data):
            if t in WEBP_META:
                payload = data[a + 8:b]
                if t == b'EXIF' and payload.startswith(b'Exif\0\0'):
                    payload = payload[6:]
                yield ('exif' if t == b'EXIF' else 'text'), payload


def exif_tags(tiff):
    """Return {tag: (count, value_bytes)} from IFD0 and the Exif sub-IFD."""
    if len(tiff) < 8 or tiff[:2] not in (b'II', b'MM'):
        return {}, '<'
    e = '<' if tiff[:2] == b'II' else '>'
    tags = {}

    def ifd(off, depth):
        if depth > 2 or off + 2 > len(tiff):
            return
        for k in range(struct.unpack(e + 'H', tiff[off:off + 2])[0]):
            entry = tiff[off + 2 + 12 * k:off + 14 + 12 * k]
            if len(entry) < 12:
                return
            tag, _, count = struct.unpack(e + 'HHI', entry[:8])
            tags[tag] = (count, entry[8:])
            if tag == 0x8769:
                ifd(struct.unpack(e + 'I', entry[8:])[0], depth + 1)

    ifd(struct.unpack(e + 'I', tiff[4:8])[0], 0)
    return tags, e


def identifying_metadata(data):
    found = set()
    for kind, payload in metadata_payloads(data):
        if kind == 'exif':
            tags, e = exif_tags(payload)
            if 0x8825 in tags:
                off = struct.unpack(e + 'I', tags[0x8825][1])[0]
                if off + 2 <= len(payload) and struct.unpack(e + 'H', payload[off:off + 2])[0] > 1:
                    found.add('GPS location')
            if 0xA431 in tags:
                found.add('device serial number')
            if 0xA430 in tags:
                found.add('camera owner name')
        else:
            text = payload.decode('latin1')
            if re.search(r'GPS(Latitude|Longitude)', text):
                found.add('GPS location')
            if re.search(r'SerialNumber', text):
                found.add('device serial number')
            if re.search(r'(/Users/|/home/|[A-Za-z]:\\\\?Users\\)', text):
                found.add('computer file path')
    return sorted(found)


def strip(data):
    kind = image_kind(data)
    if kind == 'jpeg':
        out = bytearray(data[:2])
        for marker, span in jpeg_segments(data):
            if marker is None:
                out += data[span:]
                break
            if marker not in JPEG_META:
                out += data[span[0]:span[1]]
        return bytes(out)
    if kind == 'png':
        return data[:8] + b''.join(data[a:b] for t, (a, b) in png_chunks(data) if t not in PNG_META)
    if kind == 'webp':
        # Leave the VP8X flags alone; browsers ignore the missing chunks.
        body = b''.join(data[a:b] for t, (a, b) in webp_chunks(data) if t not in WEBP_META)
        return b'RIFF' + struct.pack('<I', len(body) + 4) + b'WEBP' + body
    raise ValueError('unsupported image type')


def git(*args):
    return subprocess.run(['git', *args], capture_output=True, check=True).stdout


def check(paths, read):
    problems = []
    for path in paths:
        if BLOCKED_NAME.search(path) or BLOCKED_EXT.search(path):
            problems.append(f'{path}: this file type should not be published')
            continue
        data = read(path)
        if image_kind(data):
            meta = identifying_metadata(data) if KEEP_CREDITS else image_metadata(data)
            if meta and KEEP_CREDITS:
                problems.append(f'{path}: identifying image metadata ({", ".join(meta)}). '
                                f'Re-export without location, or strip everything with --strip')
            elif meta:
                problems.append(f'{path}: image metadata ({", ".join(meta)}). '
                                f'Fix: python3 scripts/check_sensitive.py --strip {path}')
        elif TEXT_EXT.search(path):
            text = data.decode('utf-8', 'replace')
            for label, pattern in TEXT_PATTERNS.items():
                for m in pattern.finditer(text):
                    line = text.count('\n', 0, m.start()) + 1
                    problems.append(f'{path}:{line}: possible {label}: {m.group(0)[:40]}')
    return problems


def main(argv):
    if argv[:1] == ['--strip']:
        for path in argv[1:]:
            with open(path, 'rb') as f:
                data = f.read()
            with open(path, 'wb') as f:
                f.write(strip(data))
            print(f'stripped {path}')
        return 0

    if argv[:1] == ['--all']:
        paths = git('ls-files', '-z').decode().split('\0')
        read = lambda p: open(p, 'rb').read()
    else:
        paths = git('diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z').decode().split('\0')
        read = lambda p: git('show', f':{p}')
    problems = check([p for p in paths if p], read)

    if problems:
        print('Blocked: possible personal data in the files below.\n', file=sys.stderr)
        for p in problems:
            print('  ' + p, file=sys.stderr)
        print('\nIf this is intentional: git commit --no-verify', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
