import { EVENT_CONFIG } from "../../data/event";
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
        className="sticky top-0 flex items-center justify-between border-b border-antique/15 bg-obsidian/90 px-5 py-4 backdrop-blur-md sm:px-10"
        style={{ zIndex: "var(--z-nav)" }}
      >
        <a href="#top" className="label text-ivory/60 transition-colors hover:text-ivory">
          ← Return to the circle
        </a>
        <span className="label text-mukut">{EVENT_CONFIG.brandLine}</span>
      </header>

      <main className="px-5 pt-12 pb-24 sm:px-10">
        <div className="mx-auto max-w-2xl">
          <p className="label text-center text-antique">{EVENT_CONFIG.brandLine}</p>
          <h1 className="display-type mt-3 text-center text-[clamp(2rem,5vw,3.2rem)] text-ivory">{title}</h1>
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
