import { forwardRef } from "react";
import { cx } from "../../lib/utils";

/**
 * The garbo emblem — a pierced clay lamp inside a chakra ring, with
 * dancers on the rim. This is the one object that travels: it scales
 * up as the doors open, then docks into the header.
 */
export const Emblem = forwardRef(function Emblem({ className, showWord = true }, ref) {
  return (
    <div ref={ref} className={cx("flex flex-col items-center", className)}>
      <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden>
        <defs>
          <radialGradient id="emGlow" cx="50%" cy="52%">
            <stop offset="0%" stopColor="var(--color-mukut)" stopOpacity=".55" />
            <stop offset="60%" stopColor="var(--color-ember)" stopOpacity=".12" />
            <stop offset="100%" stopColor="var(--color-ember)" stopOpacity="0" />
          </radialGradient>
          <mask id="emPierce">
            <rect width="200" height="200" fill="#fff" />
            <g fill="#000">
              <circle cx="100" cy="112" r="4.6" />
              <circle cx="83" cy="120" r="3.2" /><circle cx="117" cy="120" r="3.2" />
              <circle cx="100" cy="134" r="3.6" />
              <circle cx="86" cy="145" r="2.6" /><circle cx="114" cy="145" r="2.6" />
            </g>
          </mask>
        </defs>

        <circle cx="100" cy="112" r="88" fill="url(#emGlow)" />

        {/* chakra ring + dancers */}
        <g data-em-ring style={{ transformOrigin: "100px 112px" }}>
          <circle cx="100" cy="112" r="76" stroke="var(--color-antique)" strokeWidth=".9" strokeOpacity=".7" />
          <circle cx="100" cy="112" r="68" stroke="var(--color-antique)" strokeWidth=".5" strokeOpacity=".4" strokeDasharray="1 6" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={100 + Math.cos(a) * 76}
                cy={112 + Math.sin(a) * 76}
                r={i % 3 === 0 ? 2.4 : 1.4}
                fill="var(--color-gold)"
              />
            );
          })}
        </g>

        {/* the garbo */}
        <g mask="url(#emPierce)">
          <path
            d="M100 74c19 0 34 15 34 35 0 25-14 44-34 44s-34-19-34-44c0-20 15-35 34-35Z"
            fill="var(--color-brass)"
          />
          <ellipse cx="100" cy="84" rx="23" ry="5" fill="var(--color-antique)" />
        </g>

        {/* flame inside */}
        <path
          d="M100 52c5 8 9 11 9 17a9 9 0 1 1-18 0c0-6 4-9 9-17Z"
          fill="var(--color-ember)"
        />
        <path d="M100 62c2.4 3.6 4 5 4 8a4 4 0 1 1-8 0c0-3 1.6-4.4 4-8Z" fill="var(--color-mukut)" />
      </svg>

      {showWord && (
        <span data-em-word className="mt-4 block whitespace-nowrap text-center">
          <span className="display-type block text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.9] tracking-[0.06em] gilt">
            DEVI GARBA
          </span>
          <span className="label mt-3 block text-antique/70">Navratri · Ahmedabad</span>
        </span>
      )}
    </div>
  );
});