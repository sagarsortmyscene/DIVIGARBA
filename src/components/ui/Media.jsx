import { cx } from "../../lib/utils";

export function Media({ image, priority = false, className, style, ...rest }) {
  const webp = image.file.replace(/\.jpe?g$/i, ".webp");

  return (
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
