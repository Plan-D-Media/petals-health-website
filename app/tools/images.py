"""Image pipeline (2026-09-19). Reads tools/img-manifest.json (rendered sizes measured by img-measure.mjs) and, for
every image, writes:
  <name>.webp  — resized to the largest rendered box x2 (capped at MAX_W wide), alpha baked in from the mask where one exists
  <name>.<ext> — the fallback, resized the same way: JPEG for opaque images, PNG for images with alpha
Sources are read from design/assets originals where a mapping exists (better than re-encoding an already-downscaled
PNG); otherwise from the current public file. Run from app/:  python tools/images.py [--dry]
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')
DESIGN = os.path.join(os.path.dirname(ROOT), 'design', 'assets')
MAX_W = 1920            # a 1920 desktop at DPR 1 is the widest screen we serve; retina x2 applies up to that cap
Q_WEBP = 82
Q_JPEG = 82
DRY = '--dry' in sys.argv

# image -> luminance mask that should become its alpha channel (the CSS mask is then dropped)
MASKS = {
    '/assets/2_09c94b70.png': '/assets/2_bfab15d2.png',        # logo
    '/assets/2_04c0f486.png': '/assets/2_6a954d96.png',        # IWC block photo
    '/assets/2_a79aaebf.png': '/assets/2_3bcc21fb.png',        # watermark petal
    '/assets/treatments/ivf-egg.png': '/assets/treatments/ivf-egg-mask.png',
}
for n in ['child-care', 'pain', 'audiology', 'multi', 'womens-care', 'dentistry', 'cosmetic', 'ivf']:
    MASKS[f'/assets/treatments/{n}-hero.png'] = f'/assets/treatments/{n}-hero-mask.png'
# better sources than the current public file (original design exports)
SOURCES = {
    '/assets/clinics/kankurgachi.jpg': os.path.join(DESIGN, '6_02d17a93.jpg'),
    '/assets/clinics/tollygunge.jpg': os.path.join(DESIGN, '6_42063fbe.jpg'),
    '/assets/about/reception.jpg': os.path.join(DESIGN, '4_42063fbe.jpg'),
    '/assets/clinics/map.jpg': os.path.join(DESIGN, '6_84610510.jpg'),
    '/assets/about/team-card.jpg': os.path.join(DESIGN, '4_87e22a62.jpg'),
    '/assets/doctors/profile-hero-bg.jpg': os.path.join(DESIGN, 'under Find a Doctor_41d301a5.jpg'),
    '/assets/2_09c94b70.png': os.path.join(DESIGN, '2_09c94b70.png'),
    '/assets/2_04c0f486.png': os.path.join(DESIGN, '2_04c0f486.png'),
    '/assets/2_a79aaebf.png': os.path.join(DESIGN, '2_a79aaebf.png'),
}
# Petals Clinic in Bangladesh (2026-09-23): the client's own images from petalshealth.in/petals-clinic-in-bangladesh/.
# hero.jpg is their banner with its baked-in dark overlay lifted by a straight levels scale (x1.58, clipped) —
# hero-original.jpg is the file as published; nothing else is changed.
for _k, _f in {'hero': 'hero.jpg', 'gynaecology': 'Gynaecology-img.jpg', 'paediatrics': 'Paediatrics-1-img.jpg', 'cardiology': 'Cardiology-img.jpg', 'onco-gynaecology': 'Onco-Gynaecology-img.jpg', 'oncology': 'Oncology-img.jpg', 'gastroenterology': 'Gastroenterology-img.jpg', 'aesthetic-medicine': 'aesthetic-medicine-img.jpg', 'preventive-care': 'preventive-care-img.jpg'}.items():
    SOURCES[f'/assets/bangladesh/{_k}.jpg'] = os.path.join(DESIGN, 'bangladesh', _f)
# per-image overrides of the needed width (px): full-bleed backgrounds that are washed or blurred need less
OVERRIDE_W = {
    '/assets/doctors/profile-hero-bg.jpg': 1600,   # 35 % opacity, desaturated wash — 1600 is indistinguishable
    '/assets/2_a79aaebf.png': 1600,                # watermark: a soft petal at low contrast
    '/assets/clinics/map.jpg': 920,                # 78 px strip; 2x of the widest card
}
# treat as "logo-sized": also emit a 64 px favicon and a 512 px og image
LOGO = '/assets/2_09c94b70.png'

man = json.load(open(os.path.join(ROOT, 'tools', 'img-manifest.json'), encoding='utf-8'))
report = []
total_before = total_after = 0

def resolve(pub_path):
    """the file to read: a design original if mapped, else the current public file (or its converted sibling)"""
    if pub_path in SOURCES and os.path.exists(SOURCES[pub_path]): return SOURCES[pub_path]
    fs = os.path.join(PUB, pub_path.lstrip('/'))
    if os.path.exists(fs): return fs
    base = os.path.splitext(fs)[0]
    for ext in ('.png', '.jpg', '.jpeg'):
        if os.path.exists(base + ext): return base + ext
    return None

def load(pub_path):
    src = resolve(pub_path)
    return Image.open(src), src

# doctor photos are used twice: the profile hero (full size) and the list/card avatar (340 px tall) → also emit -sm
SMALL_H = 340
# phones (<768) get a 800 px-wide variant (-m) of anything wider than 900 px, chosen by a <source media> in <Img>;
# src/generated/images.json records output sizes and which images have the variant
MOBILE_W = 800
Q_MOBILE = 74   # phones: a little more compression on the 800 px variant (visually indistinguishable at 2x on a 390 px screen)
manifest_out = {}

for pub_path, m in man.items():
    if m['kind'] != 'img' or pub_path == 'video':
        continue
    src0 = resolve(pub_path)
    if not src0:
        print('missing', pub_path); continue
    fs = os.path.join(PUB, pub_path.lstrip('/'))
    before = os.path.getsize(src0)
    im, src = load(pub_path)
    im = im.convert('RGBA') if (im.mode in ('RGBA', 'LA', 'P') or pub_path in MASKS) else im.convert('RGB')
    mp = None
    if pub_path in MASKS:
        for cand in (os.path.join(PUB, MASKS[pub_path].lstrip('/')), os.path.join(DESIGN, os.path.basename(MASKS[pub_path]))):
            if os.path.exists(cand): mp = cand; break
    if mp:
        mask = Image.open(mp).convert('L')
        if mask.size != im.size:
            mask = mask.resize(im.size, Image.LANCZOS)
        im.putalpha(mask)
    has_alpha = im.mode == 'RGBA' and im.getextrema()[3][0] < 255
    if not has_alpha:
        im = im.convert('RGB')
    need_w = OVERRIDE_W.get(pub_path, m['needW'])
    need_w = min(need_w, MAX_W)
    if im.width > need_w:
        im = im.resize((need_w, round(im.height * need_w / im.width)), Image.LANCZOS)
    base, ext = os.path.splitext(fs)
    webp = base + '.webp'
    fb_ext = '.png' if has_alpha else '.jpg'
    fb = base + fb_ext
    if not DRY:
        im.save(webp, 'WEBP', quality=Q_WEBP, method=6)
        if has_alpha:
            im.quantize(256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG).save(fb, 'PNG', optimize=True)   # fallback only (non-WebP browsers): 8-bit palette
        else:
            im.save(fb, 'JPEG', quality=Q_JPEG, optimize=True, progressive=True)
        if pub_path.startswith('/assets/doctors/') and has_alpha and pub_path != '/assets/doctors/find-hero.png':
            sm = im.copy(); sm = sm.resize((round(sm.width * SMALL_H / sm.height), SMALL_H), Image.LANCZOS) if sm.height > SMALL_H else sm
            sm.save(base + '-sm.webp', 'WEBP', quality=Q_WEBP, method=6); sm.quantize(256, method=Image.Quantize.FASTOCTREE).save(base + '-sm.png', 'PNG', optimize=True)
        if fb != fs and os.path.exists(fs):
            os.remove(fs)                       # e.g. an opaque .png becomes .jpg
        if pub_path in MASKS:
            mp = os.path.join(PUB, MASKS[pub_path].lstrip('/'))
            if os.path.exists(mp): os.remove(mp)
        if im.width > 900:
            mw = MOBILE_W; mim = im.resize((mw, round(im.height * mw / im.width)), Image.LANCZOS)
            mim.save(base + '-m.webp', 'WEBP', quality=Q_MOBILE, method=6)
            (mim.quantize(256, method=Image.Quantize.FASTOCTREE) if has_alpha else mim).save(base + '-m' + fb_ext, 'PNG' if has_alpha else 'JPEG', optimize=True, **({} if has_alpha else {'quality': Q_JPEG, 'progressive': True}))
        if pub_path == LOGO:
            ico = im.copy(); ico.thumbnail((64, 64), Image.LANCZOS); ico.save(os.path.join(PUB, 'favicon.png'), 'PNG', optimize=True)
    manifest_out[os.path.splitext(pub_path)[0] + fb_ext] = {'w': im.width, 'h': im.height, 'm': im.width > 900, 'webp': True}
    if pub_path.startswith('/assets/doctors/') and has_alpha and pub_path != '/assets/doctors/find-hero.png':
        sh = SMALL_H if im.height > SMALL_H else im.height; manifest_out[os.path.splitext(pub_path)[0] + '-sm' + fb_ext] = {'w': round(im.width * sh / im.height), 'h': sh, 'm': False, 'webp': True}
    after_w = os.path.getsize(webp) if not DRY else 0
    after_fb = os.path.getsize(fb) if not DRY else 0
    total_before += before; total_after += after_w
    report.append((pub_path, m['natW'], m['natH'], im.width, im.height, before, after_w, after_fb, fb_ext, 'alpha' if has_alpha else 'opaque'))

report.sort(key=lambda r: -r[5])
print(f"{'image':52} {'source':11} {'output':11} {'before':>8} {'webp':>7} {'fallback':>9}")
for r in report:
    print(f"{r[0]:52} {str(r[1])+'x'+str(r[2]):11} {str(r[3])+'x'+str(r[4]):11} {r[5]//1024:>6} kB {r[6]//1024:>5} kB {r[7]//1024:>6} kB {r[8]} {r[9]}")
print(f"\nTOTAL before {total_before//1024} kB  webp {total_after//1024} kB")

if not DRY:
    os.makedirs(os.path.join(ROOT, 'src', 'generated'), exist_ok=True)
    json.dump(manifest_out, open(os.path.join(ROOT, 'src', 'generated', 'images.json'), 'w', encoding='utf-8'), indent=0, sort_keys=True)
    print('wrote src/generated/images.json', len(manifest_out))
