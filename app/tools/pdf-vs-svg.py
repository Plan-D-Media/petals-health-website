"""Compares the client's PDF mock against the SVG export we built from, page by page.
Renders each PDF page at 1366 px wide (design/render/pdf/NN.png), diffs it against the SVG render of the same page
(design/render/<file>.png), reports the fraction of differing pixels and the vertical bands where they differ, and
extracts the PDF text so differing bands can be named. Usage: python tools/pdf-vs-svg.py"""
import os, sys, io
import fitz  # pymupdf
import numpy as np
from PIL import Image

PDF = r"C:\Users\SWAYANG BATABYAL\Downloads\Copy of Petals website Mock (2).pdf"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "design", "render")
OUT = os.path.join(ROOT, "pdf"); os.makedirs(OUT, exist_ok=True)
# PDF page → SVG export file (the zip's names)
MAP = {2: '2', 4: '4', 6: '6', 8: '8', 10: '10', 11: '11', 12: 'Petals IVF', 13: 'Cosmetic Gynaecology & Aesthetics', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 20: 'Find a Doctor', 22: 'under Find a Doctor'}
NAMES = {2: 'Home', 4: 'About Us', 6: 'Clinic Location', 8: 'Dropdown mock', 10: "Women's Care", 11: 'Child Care', 12: 'Petals IVF', 13: 'Cosmetic Gynaecology', 14: 'Dentistry', 15: 'Multispecialty', 16: 'Yoga & Wellness', 17: 'Pain Management', 18: 'Audiology', 20: 'Find a Doctor', 22: 'Doctor profile'}

doc = fitz.open(PDF)
sys.stdout.reconfigure(encoding='utf-8')
print(f"{'page':22s} {'PDF px':>10s} {'SVG px':>10s} {'diff%':>6s}  differing bands (page y, px)")
for pno, svg in MAP.items():
    page = doc[pno - 1]
    zoom = 1366 / page.rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    img.save(os.path.join(OUT, f"{pno:02d}.png"))
    text = page.get_text("text")
    open(os.path.join(OUT, f"{pno:02d}.txt"), "w", encoding="utf-8").write(text)
    svg_path = os.path.join(ROOT, f"{svg}.png")
    if not os.path.exists(svg_path):
        print(f"{NAMES[pno]:22s} {img.width}x{img.height}   (no svg render)"); continue
    s = Image.open(svg_path).convert("RGB")
    h = min(img.height, s.height); w = min(img.width, s.width)
    a = np.array(img.crop((0, 0, w, h))).astype(int); b = np.array(s.crop((0, 0, w, h))).astype(int)
    d = (np.abs(a - b).max(axis=2) > 40)
    frac = d.mean() * 100
    rows = d.mean(axis=1) > 0.02          # rows where >2 % of pixels differ
    bands = []; start = None
    for y, v in enumerate(rows):
        if v and start is None: start = y
        if not v and start is not None:
            if y - start > 12: bands.append((start, y))
            start = None
    if start is not None: bands.append((start, h))
    merged = []
    for b0, b1 in bands:
        if merged and b0 - merged[-1][1] < 40: merged[-1] = (merged[-1][0], b1)
        else: merged.append((b0, b1))
    size_note = '' if img.height == s.height else f'  (heights differ: pdf {img.height}, svg {s.height})'
    print(f"{NAMES[pno]:22s} {img.width}x{img.height:<5d} {s.width}x{s.height:<5d} {frac:5.1f}  " + ', '.join(f'{b0}-{b1}' for b0, b1 in merged[:8]) + size_note)
