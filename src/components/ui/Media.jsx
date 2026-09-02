import { unsplash, unsplashSrcSet, SIZES } from "../../data/images";
import { cx } from "../../lib/utils";

/**
 * The single image primitive. Every photograph on the site goes
 * through here, so responsive srcset, focal point and lazy-loading
 * behaviour are defined once.
 *
 * `image.file` is either an Unsplash photo id (built into a CDN URL
 * with a srcset) or a local path starting with "/" (our own uploaded
 * photos — served as-is, no CDN to derive a srcset from).
 */
export function Media({ image, sizes = SIZES.full, priority = false, className, style, ...rest }) {
  const local = image.file.startsWith("/");

  return (
    <img
      src={local ? image.file : unsplash(image.file, { w: priority ? 2000 : 1600 })}
      srcSet={local ? undefined : unsplashSrcSet(image.file)}
      sizes={local ? undefined : sizes}
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cx("h-full w-full object-cover", className)}
      style={{ objectPosition: image.focal || "center", ...style }}
      {...rest}
    />
  );
}
