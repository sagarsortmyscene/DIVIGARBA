import { EVENT_CONFIG } from "../../data/event";
import { BRAND } from "../../data/images";
import { SiteFooter } from "../layout/SiteFooter";

function Section({ heading, paragraphs = [], bullets = [] }) {
  return (
    <section className="mt-10">
      <h2 className="label mb-3 text-mukut">{heading}</h2>
      {bullets.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-ivory/65">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rotate-45 bg-mukut/60" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-3 text-sm leading-relaxed text-ivory/65">
          {p}
        </p>
      ))}
    </section>
  );
}

/** Shared shell for every legal page — a slim header/footer of its own. */
export function LegalPage({ title, effective, intro, sections = [], footnote, children }) {
  return (
    <div className="min-h-svh">
      <header
        className="sticky top-0 flex items-center justify-between border-b border-antique/15 bg-obsidian/90 px-5 py-2 backdrop-blur-md sm:px-10"
        style={{ zIndex: "var(--z-nav)" }}
      >
        {/* Lands on the footer rather than the top of the landing page —
            you came from a footer link, so that is where you left off.
            App.jsx does the scrolling once the main view has mounted. */}
        <a href="#footer" className="label text-ivory/60 transition-colors hover:text-ivory">
          ← Back
        </a>
        <img
          src={BRAND.logo}
          alt={EVENT_CONFIG.brandLine}
          className="aspect-square w-[clamp(100px,26vw,120px)] object-contain md:w-45"
        />
      </header>

      <main className="px-5 pt-12 pb-24 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="display-type text-center text-[clamp(2rem,5vw,3.2rem)] text-ivory">{title}</h1>
          {effective && <p className="mt-4 text-center text-xs text-ivory/35">Effective {effective}</p>}

          <div className="divider-carved mt-8">
            <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
          </div>

          {intro && <p className="mt-8 text-sm leading-relaxed text-ivory/70">{intro}</p>}

          {sections.map((s) => (
            <Section key={s.heading} {...s} />
          ))}

          {children}

          {footnote && <p className="mt-12 border-t border-antique/15 pt-6 text-xs leading-relaxed text-ivory/35">{footnote}</p>}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
