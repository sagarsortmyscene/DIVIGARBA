import { cx } from "../../lib/utils";

/**
 * The single image primitive. Every photograph on the site goes through
 * here, so format, focal point and loading behaviour are defined once.
 *
 * It serves WebP with the JPEG as fallback. That is worth roughly 30%
 * on the wire for these photographs, and a <source> is resolved before
 * the request is made — so a browser fetches one file, not both. The
 * fallback matters: WebP is about 97% supported, and the <picture>
 * costs nothing to keep the remainder working.
 *
 * The webp path is derived from the jpg rather than stored twice, so a
 * new photograph only needs its .jpg listed and its .webp sitting
 * beside it.
 */
export function Media({ image, priority = false, className, style, ...rest }) {
  const webp = image.file.replace(/\.jpe?g$/i, ".webp");

  return (
    /* `contents` matters: without it the <picture> is an inline box
       with auto height, and the img's h-full would resolve against
       THAT rather than the sized parent — collapsing every photo.
       display:contents removes the wrapper from layout entirely. */
    <picture className="contents">
      {webp !== image.file && <source srcSet={webp} type="image/webp" />}
      <img
        src={image.file}
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={cx("h-full w-full object-cover", className)}
        style={{ objectPosition: image.focal || "center", ...style }}
        {...rest}
      />
    </picture>
  );
}
