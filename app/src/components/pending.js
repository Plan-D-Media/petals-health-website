// Placeholder links (2026-09-19): a link whose page does not exist yet renders as an <a> WITHOUT href — the HTML
// "placeholder link": same text and style, not focusable, not clickable, announced as a disabled link. The title
// says why. design/review-2026-09-19.md lists every one and what each would need; nothing here invents a destination.
export const PENDING_TITLE = 'This page is not available yet'
/** spread onto an <a>: keeps href when there is a real one, otherwise makes it a placeholder */
export const linkOr = (href, extra = {}) => (href && href !== '#' ? { href, ...extra } : { 'aria-disabled': 'true', title: PENDING_TITLE, className: (extra.className ? extra.className + ' ' : '') + 'is-pending', ...Object.fromEntries(Object.entries(extra).filter(([k]) => k !== 'className')) })
