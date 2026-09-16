import subprocess, os, sys
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.dirname(os.path.abspath(__file__))
jobs = [
  ("base_1366.png",   1366, 4900, "http://127.0.0.1:4173/"),
  ("polish_1366.png", 1366, 4900, "http://127.0.0.1:4173/?polish=1"),
  ("polish_1920.png", 1920, 4900, "http://127.0.0.1:4173/?polish=1"),
  ("base_1920.png",   1920, 4900, "http://127.0.0.1:4173/"),
  ("demo.png",        1366, 2400, "http://127.0.0.1:4173/polish-demo.html"),
]
only = sys.argv[1:]
for name, w, h, url in jobs:
    if only and name not in only: continue
    out = os.path.join(OUT, name)
    r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                        f"--window-size={w},{h}", "--virtual-time-budget=10000", f"--screenshot={out}", url],
                       capture_output=True, text=True, timeout=120)
    print(name, os.path.exists(out), os.path.getsize(out) if os.path.exists(out) else r.stderr[-200:], flush=True)
