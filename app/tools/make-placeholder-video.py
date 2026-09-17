"""Placeholder hero footage: a slow push-in on the design's hero photo, composited on the hero gradient at the slot's
own crop, ping-ponged so the loop is seamless. Output: app/public/media/hero-placeholder.mp4 (h264, muted, 11:15).
Run from app/: python tools/make-placeholder-video.py
"""
import os, subprocess, math
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "public", "assets")
OUT_DIR = os.path.join(ROOT, "public", "media"); os.makedirs(OUT_DIR, exist_ok=True)
S = 2                                   # render at 2× the 1366 layout
SLOT_W, SLOT_H = 497.7, 678.7           # Hero.css .hero__photo (11:15)
IMG_W, IMG_H, IMG_X, IMG_Y = 614.7, 749.6, -56.2, -36.1   # .hero__photo img
SLOT_X, SLOT_Y = 120.5, 59.6            # slot in the hero band (1366 wide)
CX, CY, R = 683 - 0.8, 368.2, 786.5     # hero radial gradient: white → #e3f2ff
W, H = int(round(SLOT_W * S)) // 2 * 2, int(round(SLOT_H * S)) // 2 * 2   # 996 × 1358 (even for yuv420p)

# background: the hero gradient sampled where the slot sits
ys, xs = np.mgrid[0:H, 0:W]
d = np.sqrt((xs / S + SLOT_X - CX) ** 2 + (ys / S + SLOT_Y - CY) ** 2) / R
t = np.clip(d, 0, 1)[..., None]
bg = (np.array([255, 255, 255]) * (1 - t) + np.array([0xE3, 0xF2, 0xFF]) * t).astype(np.uint8)
frame = Image.fromarray(bg, "RGB")

# photo + luminance mask, scaled and offset exactly as the CSS does
photo = Image.open(os.path.join(ASSETS, "2_04c0f486.png")).convert("RGB").resize((int(IMG_W * S), int(IMG_H * S)), Image.LANCZOS)
mask = Image.open(os.path.join(ASSETS, "2_6a954d96.png")).convert("L").resize(photo.size, Image.LANCZOS)
frame.paste(photo, (int(round(IMG_X * S)), int(round(IMG_Y * S))), mask)
still = os.path.join(ROOT, "..", "design", "render", "video", "placeholder_frame.png"); os.makedirs(os.path.dirname(still), exist_ok=True); frame.save(still)

# 6 s push-in to 1.08×, then reversed → 12 s seamless loop, 30 fps
out = os.path.join(OUT_DIR, "hero-placeholder.mp4")
zoom = "zoompan=z='1+0.08*on/180':d=180:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'" + f":s={W}x{H}:fps=30"
cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", still,   # one still in; zoompan emits 180 frames from it
       "-filter_complex", f"[0:v]{zoom}[a];[a]split[b][c];[c]reverse[r];[b][r]concat=n=2:v=1:a=0,format=yuv420p[v]",
       "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-movflags", "+faststart", "-an", out]
subprocess.run(cmd, check=True)
print(out, os.path.getsize(out) // 1024, "KB", f"{W}x{H}", "ratio", round(W / H, 4), "(11:15 =", round(11 / 15, 4), ")")
