#!/usr/bin/env python3
"""
split_svg.py — prepare Canva SVG exports for Claude Code.

Canva embeds every photo inside the SVG as base64, which is why the files are
10-30 MB. This script pulls those images out into separate files and rewrites
the SVG to reference them, leaving a small file that holds only geometry, text
and colour — the part a developer or Claude Code actually needs to read.

Usage:
    python split_svg.py <input-folder> <output-folder>

Example:
    python split_svg.py . design
"""

import base64
import hashlib
import os
import re
import sys

# Matches xlink:href="data:image/png;base64,AAAA..." and the plain href variant.
DATA_URI = re.compile(
    r'(xlink:href|href)\s*=\s*"data:image/([a-zA-Z0-9.+-]+);base64,([^"]+)"'
)

EXT = {"jpeg": "jpg", "svg+xml": "svg"}


def process(src_path, out_svg_dir, out_asset_dir):
    name = os.path.splitext(os.path.basename(src_path))[0]
    with open(src_path, "r", encoding="utf-8", errors="replace") as fh:
        svg = fh.read()

    original_size = len(svg.encode("utf-8"))
    saved = []

    def replace(match):
        attr, mime, b64 = match.group(1), match.group(2), match.group(3)
        try:
            raw = base64.b64decode(b64)
        except Exception:
            return match.group(0)  # leave anything unparseable alone

        ext = EXT.get(mime.lower(), mime.lower())
        digest = hashlib.md5(raw).hexdigest()[:8]
        filename = "{}_{}.{}".format(name, digest, ext)
        target = os.path.join(out_asset_dir, filename)

        if not os.path.exists(target):
            with open(target, "wb") as out:
                out.write(raw)
        saved.append((filename, len(raw)))
        return '{}="../assets/{}"'.format(attr, filename.replace('&', '&amp;'))

    stripped = DATA_URI.sub(replace, svg)

    out_path = os.path.join(out_svg_dir, os.path.basename(src_path))
    with open(out_path, "w", encoding="utf-8") as out:
        out.write(stripped)

    new_size = len(stripped.encode("utf-8"))
    return original_size, new_size, saved


def audit(svg_dir):
    """Report whether text survived as real <text> or was flattened to paths."""
    print("\nText check (does the SVG keep readable text?)")
    print("-" * 62)
    for f in sorted(os.listdir(svg_dir)):
        if not f.lower().endswith(".svg"):
            continue
        with open(os.path.join(svg_dir, f), "r", encoding="utf-8", errors="replace") as fh:
            body = fh.read()
        n_text = len(re.findall(r"<text[\s>]", body))
        n_path = len(re.findall(r"<path[\s>]", body))
        fonts = sorted(set(re.findall(r'font-family="([^"]+)"', body)))
        verdict = "TEXT OK" if n_text else "PATHS ONLY"
        print("  {:<38} {:>10}  text={:<5} path={:<6}".format(
            f[:38], verdict, n_text, n_path))
        if fonts:
            print("      fonts: {}".format(", ".join(fonts[:6])))


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    src_dir, out_dir = sys.argv[1], sys.argv[2]
    out_svg_dir = os.path.join(out_dir, "svg")
    out_asset_dir = os.path.join(out_dir, "assets")
    os.makedirs(out_svg_dir, exist_ok=True)
    os.makedirs(out_asset_dir, exist_ok=True)

    files = sorted(f for f in os.listdir(src_dir) if f.lower().endswith(".svg"))
    if not files:
        print("No .svg files found in {}".format(src_dir))
        sys.exit(1)

    total_before = total_after = 0
    print("Processing {} file(s)\n".format(len(files)))
    print("  {:<38} {:>10} {:>10} {:>7}".format("FILE", "BEFORE", "AFTER", "IMAGES"))
    print("  " + "-" * 68)

    for f in files:
        before, after, saved = process(
            os.path.join(src_dir, f), out_svg_dir, out_asset_dir)
        total_before += before
        total_after += after
        print("  {:<38} {:>9}K {:>9}K {:>7}".format(
            f[:38], before // 1024, after // 1024, len(saved)))

    print("  " + "-" * 68)
    print("  {:<38} {:>9}K {:>9}K".format(
        "TOTAL", total_before // 1024, total_after // 1024))

    audit(out_svg_dir)

    print("\nDone.")
    print("  Lean SVGs : {}".format(out_svg_dir))
    print("  Images    : {}".format(out_asset_dir))


if __name__ == "__main__":
    main()
