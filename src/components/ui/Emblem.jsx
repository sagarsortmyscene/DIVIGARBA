import { forwardRef } from "react";
import { cx } from "../../lib/utils";

/**
 * The Divi Garba mark — this is the one object that travels: it scales
 * up as the temple doors open, then docks into the header.
 */
export const Emblem = forwardRef(function Emblem({ className }, ref) {
  return (
    <div ref={ref} className={cx("flex items-center justify-center", className)}>
      <img
        src="/assets/logo-divi.png"
        alt="Divi Garba"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
});
