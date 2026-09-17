# Hero footage: cut-out vs rectangle — options (2026-09-17)

The design's hero is a masked cut-out (the subject on the hero gradient). Footage fills the slot's 11:15 rectangle
instead, so the question is how that rectangle meets the page. Mocked with two stand-in clips that have real backgrounds:
- **pale**: CDC "4 Month Milestone" (public domain), mother and baby in a white interior — the closest free clip to what we
  would ask the client to shoot. Burned-in caption/logo strips are the clip's, not ours.
- **studio**: CDC nurse-midwife interview (public domain) on a purple studio backdrop — "any footage".

Captures: `design/render/video/options/` — `options_sheet_1366.png`, `options_sheet_1920.png` (poster, A × 2 clips,
B × 2 clips), `options_slot_1to1.png` (the slot at 1:1). Driver: `node app/tools/video-options.mjs`; the live page
takes `?videoStyle=flush|card&video=/media/<file>.mp4` so any clip can be dropped in without a rebuild.

## Option A — flush, matched backdrop (`HERO_VIDEO_STYLE = 'flush'`)

Square-cornered, no edge treatment. Works only as well as the backdrop match: on the pale stand-in the rectangle is
still visible where the interior's greys and shadows meet the gradient, and the slot's bottom edge sits on the band
edge. It needs footage lit to a near-white, even backdrop; anything darker than the gradient shows as a hole (studio
column). Client-side: a controlled shoot; site-side: nothing to design. Fragile — one grade change and the edge is back.

## Option B — deliberate card (`HERO_VIDEO_STYLE = 'card'`)

21 px radius (the card token), blue-900 shadow at 14 % (the card-hover shadow), 1 px 8 % inner ring. Reads as a media
panel on both clips, at both widths. Works with any footage the client produces, including a clinic interior. Two
things to decide if chosen:
1. The panel's bottom edge lands on the hero band's edge (slot bottom 738.3 on a 738 band), so the bottom corners and
   the shadow's lower half are clipped. Insetting the panel ~24 px from the bottom (a 3.5 % height reduction, the
   proportion otherwise unchanged) would let it float. That changes the slot height, so it is your call.
2. The "3 Clinics in Kolkata" pill overlaps the panel's bottom-left corner; it reads as a badge on the card, but it could
   move below it if the panel is inset.

Recommendation: **B**, unless the client commits to the controlled backdrop. It removes the dependency on the shoot.

## Shooting spec (draft for the client)

Portrait 11:15 — shoot 3:4 vertical at 1080 × 1440 or larger (2160 × 2880 preferred), 25 or 30 fps, and keep the
subject inside the central 90 % of the frame because the slot trims about 2 % from the top and bottom; a 10–15 second
take that can loop cleanly (start and end on similar poses, no cuts, minimal camera movement) is ideal. The video plays
muted, so sound is not needed and any dialogue should be avoided. If we go with Option A, the backdrop must be plain,
evenly lit and near-white (no visible wall texture, doors, shadows or props), so it can sit on the site's pale-blue
gradient without a visible edge; for Option B any clean clinic or studio setting is fine.
