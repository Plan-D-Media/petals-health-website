import './Watermark.css'
import { HEADER_HEIGHT, HERO_HEIGHT, PAGE_DY } from '../layout.js'
import Img from './Img.jsx'

// The petal watermark from design/svg/2.svg (top-level group #3).
// It is RASTER in the source: 2_a79aaebf.png (colour petals on black) whose alpha is the
// luminance of 2_3bcc21fb.png, rotated -90°, scaled 0.674671 (pt) and drawn at 7% opacity
// (Canva encodes the opacity as a mask holding a black rect with fill-opacity 0.07).
// Placed bbox (page px): x 659.5, y 446.0, 1079.4 × 1619.2; clip: x 660–1365.3, y 608.4–1982.7.
//
// It spans the hero band and the next section, and in the SVG it paints above the hero
// gradient but below hero content. A single page-level layer cannot sit between one
// sibling's background and its content, so the same layer is rendered twice with
// complementary clips: `part="hero"` inside the hero (y 608.4–880) and `part="page"` at page
// level (y 880–1982.7). Both use identical placement maths; only the clip window differs.
//
// Wide screens: the design's clip ends at the artboard edge (x 1365.3) only because the artboard
// ends there. The window is therefore left-anchored to the centred content box and open on the
// right, so the petal continues to the viewport edge rather than stopping on a hard line.

// The artwork belongs to the family-care section, which sits PAGE_DY higher than in the design (header ×1.2, hero
// concept B), so the placement and clip move with it; the split between the two parts is the hero's bottom edge.
const PLACED = { left: 659.5, top: 446.0 + PAGE_DY, width: 1079.4, height: 1619.2 }
const CLIP = { left: 660, top: 608.4 + PAGE_DY, right: 1365.3, bottom: 1982.7 + PAGE_DY }
const SPLIT = HEADER_HEIGHT + HERO_HEIGHT

export default function Watermark({ part, offsetTop = 0 }) {
  // clip window in page coordinates for this part
  const top = part === 'hero' ? CLIP.top : SPLIT
  const bottom = part === 'hero' ? SPLIT : CLIP.bottom
  const win = { left: CLIP.left, top, width: CLIP.right - CLIP.left, height: bottom - top }
  return (
    <div
      className="watermark"
      aria-hidden="true"
      style={{
        // page x → viewport x: the 1366 content box is centred, so page 0 = 50% − 683 px
        left: `calc(50% - 683px + ${win.left}px)`,
        right: 0,                       // no right clip: the artwork continues to the viewport edge instead of cutting at 1365.3
        top: win.top - offsetTop,
        height: win.height,
      }}
    >
      <div
        className="watermark__box"
        style={{
          left: PLACED.left - win.left,
          top: PLACED.top - win.top,
          width: PLACED.width,
          height: PLACED.height,
        }}
      >
        <Img src="/assets/2_a79aaebf.png" alt="" />
      </div>
    </div>
  )
}
