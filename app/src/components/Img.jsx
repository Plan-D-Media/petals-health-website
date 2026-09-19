import SIZES from '../generated/images.json'

// <Img> — every content image goes through here. Renders <picture> with:
//   - a phone source (<768 px) of the 800 px-wide "-m" variant when tools/images.py made one (images wider than 900)
//   - a WebP source, and the original file (JPEG / PNG) as the fallback
//   - width/height from the generated manifest so the box is reserved before the bytes arrive (no layout shift)
// Defaults to lazy loading; the one LCP image per page passes `priority` for eager + fetchpriority="high"
// (tools/postbuild.mjs also preloads it). Extra props go to the <img>.
const webpOf = (src) => src.replace(/\.(png|jpe?g)$/i, '.webp')
const variant = (src, suffix) => src.replace(/(\.(?:png|jpe?g))$/i, `${suffix}$1`)

export default function Img({ src, alt = '', priority = false, className, style, width, height, sizes, ...rest }) {
  const meta = SIZES[src]
  const webp = webpOf(src)
  const w = width ?? meta?.w; const h = height ?? meta?.h
  return (
    <picture>
      {meta?.m && <source media="(max-width: 767px)" type="image/webp" srcSet={webpOf(variant(src, '-m'))} />}
      {meta?.m && <source media="(max-width: 767px)" srcSet={variant(src, '-m')} />}
      {webp !== src && <source type="image/webp" srcSet={webp} sizes={sizes} />}
      <img
        src={src} alt={alt} className={className} style={style} width={w} height={h} sizes={sizes}
        loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined}
        {...rest}
      />
    </picture>
  )
}
