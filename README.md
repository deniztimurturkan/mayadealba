# mayadealba

hi!!

python -m http.server 4000

## Privacy checks

`scripts/check_sensitive.py` blocks identifying photo metadata (GPS, device serials, file paths; artist credits are kept), PDFs/HEIC/Office files, phone numbers, keys, and Claude Code files from being published. It runs before every deploy, and as a pre-commit hook once enabled in a fresh clone:

    git config core.hooksPath .githooks

Image metadata is kept on purpose so the artwork stays credited. To remove everything from one image: `python3 scripts/check_sensitive.py --strip path/to/image.jpg`
