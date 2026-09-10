import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion, useIsMobile } from "../../hooks/useMediaQuery";


export function Atmosphere() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useGSAP(
    () => {
      if (reduced) return;


      gsap.to(ref.current.querySelector("[data-burn]"), {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true },
      });


      if (mobile) return;

      gsap.utils.toArray(ref.current.querySelectorAll("[data-ember]")).forEach((e, i) => {
        gsap.to(e, {
          y: `random(-${140 + i * 10}, -${60 + i * 10})`,
          x: `random(-40, 40)`,
          opacity: `random(0.08, 0.4)`,
          duration: `random(9, 18)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });
    },
    { scope: ref, dependencies: [reduced, mobile] }
  );

  const embers = Array.from({ length: mobile ? 8 : 22 });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: "var(--z-background)" }}
    >
      <div
        data-burn
        className="absolute inset-0"
        style={{
          backgroundSize: "100% 220%",
          backgroundPosition: "50% 0%",
          backgroundImage: `
            radial-gradient(120% 60% at 50% 0%, rgba(240,193,75,0.20), transparent 60%),
            radial-gradient(80% 50% at 12% 28%, rgba(168,121,44,0.18), transparent 64%),
            radial-gradient(80% 50% at 88% 64%, rgba(143,23,18,0.22), transparent 62%),
            linear-gradient(180deg, #120a04 0%, #241206 40%, #100805 74%, #070504 100%)
          `,
        }}
      />
      {embers.map((_, i) => (
        <span
          key={i}
          data-ember
          className="absolute rounded-full bg-mukut"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: i % 4 === 0 ? 2.5 : 1.5,
            height: i % 4 === 0 ? 2.5 : 1.5,
            opacity: 0.18,
            filter: "blur(0.4px)",
          }}
        />
      ))}
    </div>
  );
}
