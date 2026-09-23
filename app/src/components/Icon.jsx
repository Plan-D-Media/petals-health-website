// Icons are the exact glyph paths lifted from design/svg/2.svg (see app/src/icons/),
// converted to CSS px. Fills are replaced with currentColor so tokens drive the colour.
import phone from '../icons/phone.svg?raw'
import calendar from '../icons/calendar.svg?raw'
import findDoctor from '../icons/find-doctor.svg?raw'
import askDoctor from '../icons/ask-doctor.svg?raw'
import chevron from '../icons/chevron.svg?raw'
import pin from '../icons/pin.svg?raw'
import star from '../icons/star.svg?raw'
import petalOutline from '../icons/petal-outline.svg?raw'
import quoteMark from '../icons/quote-mark.svg?raw'
import search from '../icons/search.svg?raw'   // stroke glyph: the magnifier Find a Doctor draws inline, added to the set for the rail and header

const ICONS = { phone, calendar, findDoctor, askDoctor, chevron, pin, star, petalOutline, quoteMark, search }

export default function Icon({ name, className, style }) {
  const svg = ICONS[name].replace(/fill="#[0-9a-f]{6}"/gi, 'fill="currentColor"')
  return (
    <span
      className={className}
      style={{ display: 'inline-block', lineHeight: 0, ...style }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
