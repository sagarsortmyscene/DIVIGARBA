import { useState } from "react";
import { LegalPage } from "./LegalPage";
import { EVENT_CONFIG } from "../../data/event";

const KEY = "privacy-choices:optional-tracking";

/** Read once, at first render. In an effect this rendered the page with
 *  the wrong answer and then immediately re-rendered with the right one. */
function storedChoice() {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    /* private browsing, storage blocked — default stays off */
    return false;
  }
}

export function PrivacyChoicesPage() {
  const [allowed, setAllowed] = useState(storedChoice);
  const [saved, setSaved] = useState(false);

  function save(next) {
    setAllowed(next);
    setSaved(true);
    try {
      localStorage.setItem(KEY, String(next));
    } catch {
      /* nothing to persist to; the in-memory choice still applies this session */
    }
  }

  return (
    <LegalPage
      title="Privacy Choices"
      intro={`${EVENT_CONFIG.brandLine} only turns on optional analytics (Meta Pixel) when you allow it here. Rejecting it never affects your ability to use the website, waitlist, or ticketing services — necessary storage for basic page behaviour and waitlist protection stays on either way.`}
    >
      <section className="mt-10">
        <h2 className="label mb-3 text-mukut">Optional tracking</h2>

        <div className="frame-ancient flex flex-wrap items-center justify-between gap-4 bg-maroon/20 px-5 py-5">
          <div>
            <p className="text-sm text-ivory">Allow optional tracking (Meta Pixel)</p>
            <p className="mt-1 text-xs text-ivory/45">
              Currently {allowed ? "allowed" : "not allowed"}.
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => save(false)}
              aria-pressed={!allowed}
              className={`rounded-full border px-4 py-2 text-xs transition-colors duration-400 ${
                !allowed ? "border-mukut bg-mukut font-medium text-obsidian" : "border-antique/30 text-ivory/70 hover:border-mukut/70 hover:text-ivory"
              }`}
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => save(true)}
              aria-pressed={allowed}
              className={`rounded-full border px-4 py-2 text-xs transition-colors duration-400 ${
                allowed ? "border-mukut bg-mukut font-medium text-obsidian" : "border-antique/30 text-ivory/70 hover:border-mukut/70 hover:text-ivory"
              }`}
            >
              Allow
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-ivory/35" aria-live="polite">
          {saved ? "Saved on this device." : "Your last saved choice loads automatically next time."}
        </p>
      </section>
    </LegalPage>
  );
}
