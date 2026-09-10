import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BRAND } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";

const NAV = [
  { label: "Home",    href: "#home" },
  { label: "Gallery", href: "#gallery" },
  { label: "About",   href: "#details" },
];

export function SiteHeader() {
  const ref = useRef(null);
  const [stuck, setStuck] = useState(false);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, y: -14, duration: 1, delay: 0.6, ease: "power3.out" });
    },
    { scope: ref }
  );

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={ref}
      className={`pointer-events-none fixed top-0 left-0 flex w-full items-center justify-between gap-6 px-5 py-3 transition-colors duration-300 sm:px-9 ${
        stuck ? "border-b border-antique/15 bg-obsidian/95" : "border-b border-transparent"
      }`}
      style={{ zIndex: "var(--z-nav)" }}
    >

      <div className="pointer-events-auto flex shrink-0 items-center gap-1.5 sm:gap-4">
        <a href="#home" aria-label={`${EVENT_CONFIG.brandLine}, home`}>
          <img
            src={BRAND.logo}
            alt={EVENT_CONFIG.brandLine}

            className={`object-cover transition-all duration-300 ${
              stuck ? "h-12 w-19 sm:h-16 sm:w-25" : "h-15 w-24 sm:h-22 sm:w-35"
            }`}
          />
        </a>

        <span
          aria-hidden
          className={`w-px bg-antique/30 transition-all duration-300 ${
            stuck ? "h-4 sm:h-7" : "h-5 sm:h-10"
          }`}
        />

        <img
          src={BRAND.panchatva}
          alt={EVENT_CONFIG.organiserName}
          className={`w-auto object-contain transition-all duration-300 ${
            stuck ? "h-5 sm:h-10" : "h-6 sm:h-14"
          }`}
        />
      </div>

      <nav className="pointer-events-auto hidden items-center gap-9 md:flex">
        {NAV.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="text-[1.15rem] tracking-[0.14em] uppercase text-ivory/70 transition-colors duration-400 hover:text-mukut"
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        id="buy-btn"
        data-cursor="cta"
        className="cta-label pointer-events-auto shrink-0 cursor-pointer rounded-full border border-mukut bg-mukut px-5 py-2.5 text-obsidian transition-colors duration-500 hover:border-gold hover:bg-gold"
      >
        Book ticket
      </button>
    </header>
  );
}
