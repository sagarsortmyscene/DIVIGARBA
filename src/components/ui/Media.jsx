import { unsplash, unsplashSrcSet, SIZES } from "../../data/images";
import { cx } from "../../lib/utils";

/**
 * The single image primitive. Every photograph on the site goes
 * through here, so responsive srcset, focal point and lazy-loading
 * behaviour are defined once.
 */
export function Media({ image, sizes = SIZES.full, priority = false, className, style, ...rest }) {
  return (
    <img
      src={unsplash(image.file, { w: priority ? 2000 : 1600 })}
      srcSet={unsplashSrcSet(image.file)}
      sizes={sizes}
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
