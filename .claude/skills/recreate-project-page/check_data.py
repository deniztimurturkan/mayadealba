"""Sanity-check assets/js/data.js without Node.

Catches the mistake that once blanked the whole Surface Design grid: an unescaped
apostrophe inside a single-quoted string. Also checks bracket balance and that every
referenced image path exists on disk.

Usage (from repo root):  python .claude/skills/recreate-project-page/check_data.py
"""
import os, re, sys

path = 'assets/js/data.js'
src = open(path, encoding='utf-8').read()
problems = []

for n, line in enumerate(src.splitlines(), 1):
    stripped = re.sub(r"\.", "", line)           # drop escaped chars
    if stripped.lstrip().startswith(('//', '/*', '*')):
        continue
    # a data line is `key: '...'` or `'...'` — it should hold an even number of quotes
    if re.match(r"^\s*([\w$]+:\s*)?'", stripped) and stripped.count("'") % 2:
        problems.append(f'{path}:{n}: odd number of quotes (unescaped apostrophe?)')

for a, b in ('{}', '[]', '()'):
    if src.count(a) != src.count(b):
        problems.append(f'unbalanced {a}{b}: {src.count(a)} vs {src.count(b)}')

for m in re.finditer(r"'(assets/images/[^']+)'", src):
    if not os.path.exists(m.group(1)):
        problems.append(f'missing image: {m.group(1)}')

print('\n'.join(problems) if problems else 'data.js OK')
sys.exit(1 if problems else 0)
