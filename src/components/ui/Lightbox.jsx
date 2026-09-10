import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Media } from "./Media";
import { useReducedMotion } from "../../hooks/useMediaQuery";


export function Lightbox({ shot, onClose }) {
  const cardRef = useRef(null);
  const backRef = useRef(null);
  const reduced = useReducedMotion();

  
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove("lightbox-open");
    };
  }, []);

  useGSAP(
    () => {
      if (reduced) {
        gsap.set([backRef.current, cardRef.current], { opacity: 1, rotateY: 0, scale: 1 });
        return;
      }
      gsap
        .timeline()
        .fromTo(backRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" }, 0)
        .fromTo(
          cardRef.current,
          { rotateY: -94, scale: 0.62, opacity: 0 },
          { rotateY: 0, scale: 1, opacity: 1, duration: 0.62, ease: "power3.out" },
          0.04
        );
    },
    { dependencies: [shot?.file] }
  );

  if (!shot) return null;

  
  return createPortal(
    <div
      className="fixed inset-0 grid place-items-center p-5 sm:p-10"
      style={{ zIndex: "var(--z-loader)", perspective: "1600px" }}
      role="dialog"
      aria-modal="true"
      aria-label={shot.title}
    >
      <button
        ref={backRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 cursor-zoom-out bg-obsidian/92 backdrop-blur-sm"
      />

      
      <figure
        ref={cardRef}
        className="frame-ancient frame-pips relative flex max-h-[86svh] w-[min(92vw,760px)] flex-col bg-maroon will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative aspect-3/4 max-h-[74svh] w-full min-h-0 shrink overflow-hidden sm:aspect-4/3">
          <Media image={shot} priority />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(53,10,8,0.22), transparent 42%, rgba(7,5,4,0.78))" }}
          />
          <span className="display-type absolute top-5 left-6 text-[clamp(2rem,4vw,3rem)] leading-none text-mukut">
            {shot.n}
          </span>
        </div>

        <figcaption className="shrink-0 px-6 pt-4 pb-5">
          
          <h3 className="display-type text-2xl text-ivory">{shot.title}</h3>
          {shot.line && <p className="mt-1 text-sm text-ivory/60">{shot.line}</p>}
        </figcaption>
      </figure>

      <button
        type="button"
        onClick={onClose}
        className="label absolute top-6 right-6 cursor-pointer rounded-full border border-antique/40 bg-obsidian/80 px-4 py-2 text-mukut transition-colors hover:bg-mukut hover:text-obsidian"
        style={{ zIndex: 3 }}
      >
        Close
      </button>
    </div>,
    document.body
  );
}
