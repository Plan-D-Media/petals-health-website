"""Build-vs-design comparison with drift / deviation accounting.

Usage:  python tools/compare.py <section>   (hero | care | process | stories | specialists | hcard | insights | footer | all)

For every checked element we measure the ink box on the design render and on the build
screenshot. Each check declares its *intended* delta (a deliberate deviation: regularised
spacing, contrast fix, readability floor, opsz effect). Whatever remains after subtracting
the intended delta is *drift* — unintended difference — and should trend to zero.

Outputs per section:  DRIFT  = max and mean residual (px) over all edges of all checks
                      DEVIATION = the list of intended changes, each with its size in px
"""
import os, sys, io, socket, subprocess, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESIGN = os.path.join(ROOT, "..", "design", "render", "2.png")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def screenshot(height=4860):
    out = os.path.join(ROOT, "..", "design", "render", "build_page.png")
    srv = subprocess.Popen([sys.executable, "-m", "http.server", "4173", "--directory", os.path.join(ROOT, "dist"), "--bind", "127.0.0.1"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(40):
        try:
            with socket.create_connection(("127.0.0.1", 4173), timeout=1): break
        except OSError: time.sleep(0.5)
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox", f"--window-size=1366,{height}",
                    "--virtual-time-budget=10000", f"--screenshot={out}", "http://127.0.0.1:4173/"], capture_output=True, text=True, timeout=120)
    srv.kill()
    return out

# ---- colour tests on int arrays (H, W, 3)
def near(c, tol=40): return lambda a: (np.abs(a - np.array(c)).max(axis=2) <= tol)
black  = lambda a: a.max(axis=2) < 90
dark   = lambda a: a.max(axis=2) < 120
white  = lambda a: a.min(axis=2) > 225
navy   = near((0, 66, 126))
red    = near((237, 25, 65))
purple = near((110, 95, 161), 35)
cream  = lambda a: (a[:, :, 0] > 245) & (a[:, :, 1] > 240) & (a[:, :, 2] > 225) & (a[:, :, 2] < 250)
orange = lambda a: (a[:, :, 0] > 200) & (a[:, :, 1] < 170) & (a[:, :, 2] < 80)
salmon = near((255, 142, 122), 14)

def ink(arr, box, test):
    x0, y0, x1, y1 = box; m = test(arr[y0:y1, x0:x1])
    ys = np.where(m.any(axis=1))[0]; xs = np.where(m.any(axis=0))[0]
    if not len(xs): return None
    return (x0 + int(xs.min()), y0 + int(ys.min()), x0 + int(xs.max()), y0 + int(ys.max()))

# Each check: (name, search box, colour test, intended delta (dx0, dy0, dx1, dy1) or None, reason)
# Intended deltas are the documented deviations; "opsz" widths use ±width-growth on the right edge only.
SECTIONS = {
    "hero": [
        ("H1 line 1", (640, 330, 1100, 396), navy, (0, 0, 30, 0), "opsz unified to auto: 53 px H1 renders 10% wider than Canva's opsz-96"),
        ("H1 line 2", (640, 396, 1100, 445), red, (0, 0, 20, 0), "opsz auto: accent line 6% wider than Canva's opsz-96"),
        ("paragraph", (660, 450, 1330, 545), black, None, ""),
        ("button box", (670, 600, 1010, 690), navy, None, ""),
        ("button text", (700, 620, 980, 665), white, (7, 0, -1, 0), "label at 700 renders 8 px narrower than the Canva Bold+toggle; centred in the button"),
        ("pill text", (100, 830, 300, 860), navy, (0, 0, 7, 0), "opsz/weight: 18 px label 4% wider"),
        ("stat 100+", (1110, 780, 1200, 815), navy, None, ""),
        ("stat label L", (1110, 818, 1200, 860), navy, (-5, -3, 5, 0), "13 px floor: label raised from 11.2 px"),
        ("utility Book", (690, 50, 790, 70), navy, (2, 0, -4, 0), "13 px vs 13.33: utility links 3% narrower"),
        ("nav About", (330, 115, 395, 135), white, (0, 0, 4, 0), "13 px floor: nav raised from 12 px"),
        ("nav Petals Clinic", (885, 115, 1060, 135), white, (0, 0, 10, 0), "13 px floor: nav raised from 12 px"),
        ("logo", (190, 15, 270, 100), lambda a: a.min(axis=2) < 235, None, ""),
        ("photo", (110, 190, 630, 880), lambda a: a.min(axis=2) < 200, None, ""),
    ],
    "care": [
        ("eyebrow line", (300, 925, 1066, 975), black, (-5, 0, 5, 0), "opsz: 32 px line 3% wider, centred"),
        ("H2", (150, 975, 1250, 1040), navy, (-34, 0, 33, 0), "opsz auto: 7% wider than Canva's opsz-96; centred"),
        ("sub-line", (300, 1045, 1066, 1090), black, (-10, 0, 9, 0), "opsz: 32 px line 4% wider, centred"),
        ("card1 box", (20, 1120, 470, 1560), orange, None, ""),
        ("card1 title", (50, 1195, 300, 1240), white, (14, 0, 21, 0), "padding regularised 35 → 48; title 3% wider (opsz)"),
        ("card1 chip row1", (50, 1285, 420, 1320), salmon, (19, 0, 9, 0), "padding regularised 29 → 48"),
        ("card2 title", (500, 1195, 800, 1240), navy, (0, 0, 9, 0), "opsz: 32 px title 4% wider"),
        ("card2 subtitle", (500, 1236, 830, 1275), black, (0, 0, 10, 0), "16 px text ~3% wider"),
        ("card2 chip row1", (500, 1285, 830, 1320), cream, (0, -5, 7, 0), "cream pill edge detection; chip text width"),
        ("card3 title", (940, 1195, 1250, 1245), navy, (0, 0, 8, 8), "opsz width; descender"),
        ("card3 chips row1", (940, 1285, 1300, 1320), cream, (0, -5, -4, 0), "cream pill edge detection"),
        ("btn1 text", (140, 1468, 350, 1495), navy, (6, 0, 2, 0), "button centred (mock −3.4 off)"),
        ("btn2 text", (590, 1468, 800, 1495), navy, (-4, 0, -9, 0), "button centred (mock +8.7 off)"),
        ("btn3 text", (1030, 1468, 1240, 1495), navy, (-14, 0, -6, 0), "button centred (mock +8.7 off)"),
    ],
    "process": [
        ("eyebrow SIMPLE PROCESS", (500, 1608, 866, 1635), lambda a: a.max(axis=2) < 140, (-15, 0, -15, 0), "eyebrow centred (mock sits 15 px right of centre)"),
        ("H2 line 1", (300, 1636, 1100, 1690), navy, (-3, 0, -37, 0), "H2 centred (mock 20 px right); opsz auto 5% narrower than Canva's opsz-12"),
        ("H2 line 2", (500, 1690, 900, 1742), navy, (-14, 0, -26, 0), "H2 centred (mock 20 px right); opsz auto narrower"),
        ("circle 1 ring (top arc)", (180, 1782, 310, 1800), purple, None, ""),
        ("circle 2 fill (top arc)", (470, 1782, 600, 1800), purple, (6, 0, 6, 0), "spacing regularised (481.5 → 487.1)"),
        ("circle 3 ring (top arc)", (770, 1782, 900, 1800), purple, (5, 0, 5, 0), "spacing regularised (778.5 → 783.2)"),
        ("circle 4 ring (top arc)", (1070, 1782, 1200, 1800), purple, None, ""),
        ("digit 1", (200, 1815, 290, 1875), navy, None, ""),
        ("digit 3", (790, 1815, 880, 1875), navy, (5, 0, 5, 0), "spacing regularised"),
        ("title 1", (160, 1912, 335, 1938), lambda a: a.max(axis=2) < 140, None, ""),
        ("title 3", (740, 1912, 910, 1938), lambda a: a.max(axis=2) < 140, (5, 0, 5, 0), "spacing regularised"),
        ("desc 1", (140, 1940, 350, 2002), lambda a: a.max(axis=2) < 140, (-3, 0, 3, 0), "16 px text ~2% wider, centred"),
        ("desc 4", (1040, 1940, 1220, 2002), lambda a: a.max(axis=2) < 140, (-3, 0, 3, 0), "16 px text ~2% wider, centred"),
    ],
    "stories": [
        ("eyebrow PATIENT STORIES", (500, 2078, 866, 2105), lambda a: a.max(axis=2) < 140, (7, 0, 7, 0), "eyebrow centred (mock sits 7 px left of centre); width −10 tracking"),
        ("H2 line 1", (300, 2115, 1066, 2180), navy, (24, 0, -13, 0), "H2 centred (mock 6 px left); opsz auto 6% narrower than Canva's opsz-12"),
        ("H2 line 2", (300, 2180, 1066, 2232), navy, (22, -9, -11, -9), "line pitch regularised 58.9 → 50; centred; opsz auto narrower"),
        ("card 1 border", (90, 2262, 485, 2488), lambda a: (np.abs(a - np.array((0, 66, 126))).max(axis=2) <= 90), (0, -2, -1, -1), "cards regularised: top 2271.7 → 2270, width 378.1 → 377.4"),
        ("card 2 border", (485, 2260, 886, 2488), lambda a: (np.abs(a - np.array((0, 66, 126))).max(axis=2) <= 90), (0, 0, -14, 0), "width 392 → 377.4, x 493.6 → 493.95"),
        ("card 3 border", (895, 2260, 1280, 2488), lambda a: (np.abs(a - np.array((0, 66, 126))).max(axis=2) <= 90), (-15, 1, 0, 1), "width 361.9 → 377.4, x 905.6 → 890.2; top 2268.7 → 2270"),
        ("stars 1", (350, 2285, 460, 2312), lambda a: (a[:, :, 0] > 220) & (a[:, :, 1] > 130) & (a[:, :, 1] < 200) & (a[:, :, 2] < 120), (0, 0, 0, 0), "vector star in orange-500 vs raster"),
        ("quote 1 text", (110, 2318, 470, 2385), black, (2, 0, -12, 0), "upright Bricolage Regular is 12 px narrower than Canva Sans italic on line 1; ink top aligned"),
        ("avatar 1", (115, 2405, 175, 2465), purple, (0, -1, 0, -1), "card top regularised"),
        ("name 1", (172, 2412, 300, 2436), black, (2, 0, 5, 0), "16/700 renders 3 px wider"),
        ("role 1", (172, 2434, 400, 2455), black, (3, 0, -11, 0), "14 px Regular 11 px narrower than the mock line (14.4 px + tracking)"),
        ("avatar 3", (925, 2402, 985, 2462), purple, (-15, 1, -15, 1), "card 3 regularised (x −15.4, top +1.3)"),
    ],
    "specialists": [
        ("eyebrow", (450, 2528, 916, 2555), lambda a: a.max(axis=2) < 140, (-3, 0, -3, 0), "centred (mock 3 px right)"),
        ("H2", (300, 2555, 1066, 2632), navy, (7, 0, -7, 0), "64/700 auto opsz renders 14 px narrower; centred"),
        ("sub-line", (200, 2624, 1166, 2650), black, (-8, 0, 8, 0), "18 px estimate; centred"),
        ("card1 white body", (130, 2760, 400, 2925), white, None, ""),
        ("card2 white body", (415, 2760, 685, 2925), white, (1, 0, 1, 0), "gaps regularised 27.5 → 28.1"),
        ("card4 white body", (990, 2760, 1260, 2925), white, None, ""),
        ("name 1", (150, 2795, 400, 2830), navy, (0, 0, 17, 0), "24/600 opsz auto 9% wider than Canva's opsz-96"),
        ("avatar 1 disc", (148, 2728, 216, 2796), navy, None, ""),
        ("stars 1", (150, 2892, 245, 2915), lambda a: (a[:, :, 0] > 220) & (a[:, :, 1] > 130) & (a[:, :, 1] < 200) & (a[:, :, 2] < 120), None, "vector star"),
        ("cta 1 text", (170, 2935, 340, 2960), black, (0, 0, 4, 0), "16/500 estimate"),
        ("view-all text", (590, 3030, 780, 3055), black, (0, 0, 2, 0), "16/500 estimate"),
    ],
    "hcard": [
        ("panel left edge/top", (85, 3140, 600, 3400), navy, None, ""),
        ("eyebrow", (180, 3188, 560, 3218), white, None, ""),
        ("H2 line 1", (180, 3228, 700, 3282), white, (0, 0, 30, 0), "opsz auto: 7% wider than Canva's opsz-96"),
        ("H2 line 2", (180, 3282, 700, 3332), white, (0, -1, 26, -1), "pitch 48.6 → 50; opsz auto wider"),
        ("lead line 1", (180, 3384, 600, 3410), white, (0, 0, -9, 0), "Light@opsz96 renders 351 vs 360 on line 1"),
        ("bullet 1", (205, 3485, 560, 3512), white, (0, 0, -4, 0), "Light@opsz96 renders 294 vs 298"),
        ("button", (185, 3680, 470, 3730), white, None, ""),
        ("photo cutout", (600, 3160, 1250, 3840), lambda a: a.max(axis=2) > 150, None, ""),
    ],
    "insights": [
        ("eyebrow", (450, 3912, 916, 3940), lambda a: a.max(axis=2) < 140, (2, 0, 2, 0), "centred (mock 2 px left)"),
        ("H2", (300, 3945, 1066, 4002), navy, (17, 0, -18, 0), "opsz auto 5% narrower than Canva's opsz-12; centred"),
        ("sub-line", (300, 4022, 1066, 4050), black, (-6, 0, 6, 0), "21 px render; centred"),
        ("card1 border", (135, 4078, 480, 4318), lambda a: (np.abs(a - np.array((0, 66, 126))).max(axis=2) <= 90), None, ""),
        ("card2 border", (510, 4078, 860, 4318), lambda a: (np.abs(a - np.array((0, 66, 126))).max(axis=2) <= 90), (-3, 0, -3, 0), "gaps regularised 46.1/39.4 → 42.75"),
        ("card3 border", (880, 4078, 1230, 4318), lambda a: (np.abs(a - np.array((0, 66, 126))).max(axis=2) <= 90), None, ""),
        ("topic 1", (155, 4140, 400, 4170), black, (0, 0, -7, 0), "24/600 opsz auto 4% narrower"),
        ("excerpt 1", (155, 4174, 470, 4225), black, (0, 0, 6, 0), "19/400 width"),
        ("meta 1", (155, 4272, 400, 4295), lambda a: (a[:, :, 1] > 150) & (a[:, :, 0] < 100), (0, 0, 4, 0), "14 px"),
        ("read-more text", (590, 4358, 760, 4382), black, (0, 0, 2, 0), "16/500"),
    ],
    "footer": [
        ("main band", (0, 4436, 1366, 4762), navy, (0, 0, 0, 0), ""),
        ("about para 1", (60, 4462, 500, 4508), white, (0, 0, 54, 4), "13 px floor + column widened 376 → 430; pitch 12.7 → 14"),
        ("heading Information", (515, 4462, 640, 4484), lambda a: (a[:, :, 0] > 200) & (a[:, :, 1] > 130) & (a[:, :, 2] < 200), (2, 0, 8, 0), "orange-500 vs #ffd591; 16/400 renders wider"),
        ("link About Us", (515, 4494, 640, 4512), white, (0, 0, 2, 0), "13 vs 12.4"),
        ("heading Policies", (1183, 4462, 1310, 4484), lambda a: (a[:, :, 0] > 200) & (a[:, :, 1] > 130) & (a[:, :, 2] < 200), None, ""),
        ("ISO heading", (60, 4682, 300, 4702), lambda a: (a[:, :, 0] > 200) & (a[:, :, 1] > 130) & (a[:, :, 2] < 200), (0, 0, 0, 0), "16/700 estimate"),
        ("copyright line 1", (60, 4768, 450, 4782), lambda a: a.min(axis=2) > 200, (0, 0, 30, 0), "13 px floor: line 30 px longer than the 11.9 px mock"),
        ("phone", (60, 4812, 260, 4842), white, (0, 0, 4, 0), "22 px"),
    ],
}

def run(section, B, D):
    checks = SECTIONS[section]; residuals = []; rows = []; deviations = []
    for name, box, test, intended, reason in checks:
        d = ink(D, box, test); b = ink(B, box, test)
        if d is None or b is None:
            rows.append((name, d, b, "n/a")); continue
        delta = tuple(b[i] - d[i] for i in range(4))
        intended = intended or (0, 0, 0, 0)
        resid = tuple(delta[i] - intended[i] for i in range(4))
        residuals += [abs(r) for r in resid]
        rows.append((name, delta, intended if any(intended) else "-", resid))
        if any(intended): deviations.append((name, intended, reason))
    print(f"\n=== {section.upper()} ===")
    print("element | measured delta | intended (deviation) | residual (drift)")
    for r in rows: print(" | ".join(str(x) for x in r))
    if residuals:
        print(f"\nDRIFT   max {max(residuals)} px, mean {np.mean(residuals):.2f} px over {len(residuals)} edges")
    print(f"DEVIATION  {len(deviations)} intended changes:")
    for name, intended, reason in deviations: print(f"  - {name}: {intended} — {reason}")

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    shot = screenshot()
    B = np.array(Image.open(shot).convert("RGB")).astype(int)
    D = np.array(Image.open(DESIGN).convert("RGB")).astype(int)[:B.shape[0]]
    for s in (SECTIONS.keys() if which == "all" else [which]): run(s, B, D)
