"""Dump the geometry of a page band from a Canva SVG export, in CSS px at the 1366 canvas.

Usage: python tools/svgdump.py <svg> <y0px> <y1px>
Prints: big shapes, images, stroked paths, masks (opacity / mask image), rounded clips (radius),
gradients used, and text lines clustered from glyph outlines (fill, union box, size hints).
"""
import re, sys, io, os, xml.etree.ElementTree as ET
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
NS = {"svg": "http://www.w3.org/2000/svg", "xlink": "http://www.w3.org/1999/xlink"}
K = 4 / 3

def tag(e): return e.tag.split("}")[1]
def parse_tf(t):
    if not t: return (1, 0, 0, 1, 0, 0)
    m = re.match(r"\s*matrix\(([^)]*)\)", t)
    if m: return tuple(float(x) for x in re.split(r"[ ,]+", m.group(1).strip()))
    m = re.match(r"\s*translate\(([^)]*)\)", t)
    v = [float(x) for x in re.split(r"[ ,]+", m.group(1).strip())]
    return (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0)
def mul(A, B):
    a, b, c, d, e, f = A; a2, b2, c2, d2, e2, f2 = B
    return (a*a2 + c*b2, b*a2 + d*b2, a*c2 + c*d2, b*c2 + d*d2, a*e2 + c*f2 + e, b*e2 + d*f2 + f)
def apply(M, x, y):
    a, b, c, d, e, f = M; return (a*x + c*y + e, b*x + d*y + f)
NUM = re.compile(r"-?\d*\.?\d+(?:e-?\d+)?")
def nums(d): return [float(x) for x in NUM.findall(d)]
def bbox(d):
    n = nums(d); xs = n[0::2]; ys = n[1::2]; return (min(xs), min(ys), max(xs), max(ys))
def tbb(M, b):
    P = [apply(M, x, y) for x, y in [(b[0], b[1]), (b[2], b[3]), (b[0], b[3]), (b[2], b[1])]]
    return (min(p[0] for p in P), min(p[1] for p in P), max(p[0] for p in P), max(p[1] for p in P))
px = lambda b: tuple(round(v * K, 1) for v in b)

def dump(path, Y0px, Y1px):
    Y0, Y1 = Y0px / K, Y1px / K
    root = ET.parse(path).getroot(); children = list(root)
    clips = {cp.get("id"): cp.find("svg:path", NS).get("d") for cp in root.iter("{%s}clipPath" % NS["svg"]) if cp.find("svg:path", NS) is not None}
    masks = {m.get("id"): m for m in root.iter("{%s}mask" % NS["svg"])}
    grads = {g.get("id"): g for g in root.iter() if tag(g) in ("linearGradient", "radialGradient")}
    big, glyphs, images, clipuse, strokes, maskinfo = [], [], [], [], [], []
    def walk(e, M, fill, top, op):
        t = tag(e)
        if t in ("defs", "clipPath", "mask", "filter", "linearGradient", "radialGradient"): return
        M2 = mul(M, parse_tf(e.get("transform"))); f = e.get("fill") or fill; op2 = e.get("fill-opacity") or op
        mk = e.get("mask")
        if mk and mk[5:-1] in masks:
            r = masks[mk[5:-1]].find(".//svg:rect", NS); im = masks[mk[5:-1]].find(".//svg:image", NS)
            maskinfo.append((top, str(r.get("fill-opacity")) if r is not None else "-", str(im.get("{%s}href" % NS["xlink"])) if im is not None else "-"))
        cp = e.get("clip-path")
        if cp and cp[5:-1] in clips:
            d = clips[cp[5:-1]]; b = tbb(M2, bbox(d))
            if b[3] > Y0 and b[1] < Y1 and (b[2] - b[0]) > 20:
                n = nums(d); clipuse.append((top, px(b), len(n), round((n[0] - bbox(d)[0]) * K, 1)))
        if t == "image":
            w = float(e.get("width")); h = float(e.get("height")); b = tbb(M2, (0, 0, w, h))
            if b[3] > Y0 and b[1] < Y1: images.append((top, e.get("{%s}href" % NS["xlink"]), px(b)))
        if t == "path" and e.get("d"):
            b = tbb(M2, bbox(e.get("d")))
            if b[3] > Y0 and b[1] < Y1:
                w, h = b[2] - b[0], b[3] - b[1]
                if e.get("stroke") and e.get("stroke") != "none" and e.get("fill") in (None, "none"):
                    strokes.append((top, e.get("stroke"), e.get("stroke-width"), e.get("stroke-dasharray"), px(b)))
                elif (w > 30 and h > 12) or (f and f.startswith("url")):
                    big.append((top, f, op2, px(b), round(w * K, 1), round(h * K, 1), len(nums(e.get("d")))))
                elif f and f.startswith("#") and w <= 45 and h <= 45 and e.get("stroke") in (None, "none"):
                    glyphs.append((f, b, top))
        for ch in e: walk(ch, M2, f, top, op2)
    for i, ch in enumerate(children):
        if tag(ch) != "defs": walk(ch, (1, 0, 0, 1, 0, 0), None, i, None)
    print(f"##### {os.path.basename(path)}  y {Y0px}-{Y1px} px #####")
    print("=== BIG SHAPES (top, fill, opacity, bbox px, w x h, pts) ===")
    for r in big: print(r)
    print("=== IMAGES (top, href, bbox px) ===")
    for r in images: print(r)
    print("=== STROKES (top, stroke, width, dash, bbox px) ===")
    for r in strokes: print(r)
    print("=== MASKS (top, rect opacity, mask image) ===")
    for r in sorted(set(maskinfo)): print(r)
    print("=== CLIPS (top, bbox px, n pts, radius px) — rounded when n > 10 ===")
    seen = set()
    for r in clipuse:
        if (r[0], r[1]) in seen: continue
        seen.add((r[0], r[1]))
        if r[2] > 10: print(r)
    print("=== GRADIENTS used ===")
    for gid in sorted(set(r[1][5:-1] for r in big if r[1] and r[1].startswith("url"))):
        g = grads.get(gid)
        if g is None: continue
        st = g.findall("svg:stop", NS)
        print(gid, tag(g), {k: v for k, v in g.attrib.items() if k != "id"}, "stops", len(st), st[0].get("stop-color"), "->", st[-1].get("stop-color"))
    g = sorted(glyphs, key=lambda x: (x[0], x[1][0])); lines = []
    for f, b, top in g:
        h = b[3] - b[1]; placed = False
        for L in lines:
            if L["f"] != f: continue
            lb = L["b"]; ov = min(lb[3], b[3]) - max(lb[1], b[1])
            if ov > 0.3 * min(h, lb[3] - lb[1]) and -3 <= b[0] - lb[2] <= max(6, 1.0 * max(h, L["maxh"])):
                L["b"] = (min(lb[0], b[0]), min(lb[1], b[1]), max(lb[2], b[2]), max(lb[3], b[3])); L["n"] += 1; L["maxh"] = max(L["maxh"], h); L["hs"].append(h); placed = True; break
        if not placed: lines.append({"f": f, "b": b, "n": 1, "maxh": h, "hs": [h]})
    print("=== TEXT LINES (fill | union px | w x h | n | max glyph h | median glyph h) ===")
    for L in sorted(lines, key=lambda L: (round(L["b"][1]), L["b"][0])):
        if L["n"] < 2: continue
        b = L["b"]; hs = sorted(L["hs"])
        print(f"{L['f']} | {px(b)} | {round((b[2]-b[0])*K,1)}x{round((b[3]-b[1])*K,1)} | {L['n']} | {round(L['maxh']*K,1)} | {round(hs[len(hs)//2]*K,1)}")

if __name__ == "__main__":
    dump(sys.argv[1], float(sys.argv[2]), float(sys.argv[3]))
