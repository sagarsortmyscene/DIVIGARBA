import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BRAND } from "../../data/images";
import { EVENT_CONFIG } from "../../data/event";

/* Hash targets, all of them real section ids on the landing page.
   useHashRoute scrolls to a matching element and falls back to the top,
   so these need no click handlers of their own. */
const NAV = [
  { label: "Home",    href: "#home" },
  { label: "Gallery", href: "#gallery" },
  { label: "About",   href: "#details" },
];

/**
 * The bar: mark at the left, nav in the middle, Book ticket at the right.
 */
export function SiteHeader() {
  const ref = useRef(null);
  const [stuck, setStuck] = useState(false);

  useGSAP(
    () => {
      gsap.from(ref.current, { opacity: 0, y: -14, duration: 1, delay: 0.6, ease: "power3.out" });
    },
    { scope: ref }
  );

  /* The bar has always been position:fixed, so it already stayed put —
     what it lacked was a ground. Over the hero it is transparent by
     design; past that, content scrolls underneath and the nav becomes
     unreadable against whatever photograph happens to be behind it,
     so it takes on a solid background instead.
     A plain scroll listener rather than a ScrollTrigger: Lenis drives
     the native scroll position, so this fires normally, and `passive`
     keeps it off the critical path. The state only ever flips at the
     threshold, so React re-renders twice per crossing, not per frame. */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();                       // a reload can restore mid-page
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /* pointer-events-none on the bar, auto on each thing you can
       actually click. The header is a full-width strip with no
       background, so as a click target it would otherwise be an
       invisible sheet across the top of every page, eating clicks
       meant for whatever sits underneath it. */
    <header
      ref={ref}
      className={`pointer-events-none fixed top-0 left-0 flex w-full items-center justify-between gap-6 px-5 py-3 transition-colors duration-300 sm:px-9 ${
        stuck ? "border-b border-antique/15 bg-obsidian/95" : "border-b border-transparent"
      }`}
      style={{ zIndex: "var(--z-nav)" }}
    >
      {/* 140px wide, as asked. The height and object-cover are what
          make that work: logo-divi.png is a 750x1000 PORTRAIT canvas,
          so at 140px wide it would stand 187px tall and drag the whole
          header down with it. Only the middle 42.8% of that canvas is
          artwork (measured: opaque rows 286-714 of 1000), so an 88px
          window cropped from the centre shows the mark complete —
          104x80 of real logo — and throws away only empty space.
          Swap the logo file and this window wants re-checking. */}
      <a
        href="#home"
        className="pointer-events-auto block shrink-0"
        aria-label={`${EVENT_CONFIG.brandLine}, home`}
      >
        <img
          src={BRAND.logo}
          alt={EVENT_CONFIG.brandLine}
          /* Shrinks once the bar is solid. A 112px opaque strip across
             every page is a lot of chrome; over the hero, where it is
             transparent, the full size costs nothing. The window stays
             proportional (140x88 -> 100x63) so the crop still frames
             the mark the same way. */
          className={`object-cover transition-all duration-300 ${stuck ? "h-16 w-25" : "h-22 w-35"}`}
        />
      </a>

      {/* Hidden below md: three links plus a CTA do not fit beside a
          140px mark on a 360px screen, and the same sections are all
          reachable from the footer. */}
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

      {/* A real <button>, and #buy-btn is the selector the SortMyScene
          embed in index.html binds to (data-trigger="#buy-btn"). It
          attaches its own click handler, so this deliberately has none
          of ours — adding one would open the widget twice. HomeHero's
          "Book your passes" forwards its click here rather than
          claiming a second id the widget knows nothing about. */}
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
