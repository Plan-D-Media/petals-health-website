"""Font subsetting (2026-09-19). Bricolage Grotesque variable: drop the unused wdth axis (no font-stretch anywhere in
the CSS; wght and opsz stay variable) and subset to the Latin ranges the site uses. Lora (stat numbers) and Playfair
(monogram initials) are subset to basic Latin. Originals are kept in public/fonts/src/. Run from app/: python tools/fonts.py
"""
import io, os, shutil
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, 'public', 'fonts')
SRC = os.path.join(FONTS, 'src'); os.makedirs(SRC, exist_ok=True)
LATIN = 'U+0000-00FF,U+0100-017F,U+2000-206F,U+20B9,U+2190-2199,U+2022,U+2026,U+00D7,U+2212,U+FB01-FB02'
BASIC = 'U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D'

def keep_original(name):
    p = os.path.join(FONTS, name); s = os.path.join(SRC, name)
    if not os.path.exists(s): shutil.copy(p, s)
    return s

def run(name, unicodes, pin=None):
    src = keep_original(name)
    f = TTFont(src, lazy=False)
    if pin:
        f = instancer.instantiateVariableFont(f, pin, inplace=False, updateFontNames=False)
        buf = io.BytesIO(); f.flavor = None; f.save(buf); buf.seek(0); f = TTFont(buf, lazy=False)   # re-read so gvar carries every glyph again
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
    opts.unicodes = subset.parse_unicodes(unicodes)
    sub = subset.Subsetter(opts); sub.populate(unicodes=opts.unicodes); sub.subset(f)
    out = os.path.join(FONTS, name); f.flavor = 'woff2'; f.save(out)
    print(f"{name:40} {os.path.getsize(src)//1024:>4} kB -> {os.path.getsize(out)//1024:>4} kB  axes={[a.axisTag for a in f['fvar'].axes] if 'fvar' in f else '-'}")

run('BricolageGrotesque-Variable.woff2', LATIN, pin={'wdth': 100})
run('BricolageGrotesque-Regular.woff2', LATIN)
run('BricolageGrotesque-Bold.woff2', LATIN)
run('Lora-Variable.woff2', BASIC)
run('PlayfairDisplay-Variable.woff2', 'U+0041-005A,U+0061-007A,U+0020')
