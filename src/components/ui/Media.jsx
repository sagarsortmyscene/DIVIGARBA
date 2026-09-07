import { cx } from "../../lib/utils";

/**
 * The single image primitive. Every photograph on the site goes through
 * here, so focal point and loading behaviour are defined once.
 *
 * It used to branch on whether `image.file` was an Unsplash id or a
 * local path, building a CDN URL and a srcset for the former. Every
 * asset is local now, so that branch — and the `unsplash`,
 * `unsplashSrcSet` and `sizes` machinery behind it — was dead weight
 * that only ever took the local path.
 */
export function Media({ image, priority = false, className, style, ...rest }) {
  return (
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
  );
}
