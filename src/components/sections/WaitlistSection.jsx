import { useMemo, useRef, useState } from "react";
import { EVENT_CONFIG } from "../../data/event";
import { NightCalendar } from "../ui/NightCalendar";
import { RevealText } from "../ui/RevealText";
import { ScrollReveal } from "../motion/ScrollReveal";
import { cx } from "../../lib/utils";

const MONTH_LABEL = "October 2026";

/** Field wrapper — one definition, so every input matches. */
function Field({ label, id, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block text-ivory/50">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ivory/35">{hint}</p>}
    </div>
  );
}

const inputCx =
  "w-full border-b border-antique/25 bg-transparent py-3 text-base font-light text-ivory transition-colors duration-300 outline-none placeholder:text-ivory/25 focus:border-mukut";

export function WaitlistSection() {
  const { terms, privacy, dataDeletion, gateEntry, entryCloses } = EVENT_CONFIG;

  const [night, setNight] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState({ tone: null, text: "" });
  const [busy, setBusy] = useState(false);
  const formRef = useRef(null);

  /* A small arithmetic pause, generated once per mount. */
  const sum = useMemo(() => {
    const a = 2 + Math.floor(Math.random() * 5);
    const b = 3 + Math.floor(Math.random() * 6);
    return { a, b, answer: a + b };
  }, []);

  const gateLine = night
    ? `Night of ${night} October → gates ${gateEntry}, ${night + 1} October. Entry closes ${entryCloses}.`
    : "Choose an event-night date to see its actual next-morning gate window.";

  async function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formRef.current));

    if (!data.name || !data.phone || !data.email) {
      return setStatus({ tone: "error", text: "Add your name, WhatsApp number and email." });
    }
    if (!night) return setStatus({ tone: "error", text: "Choose one event date." });
    if (Number(data.pause) !== sum.answer) {
      return setStatus({ tone: "error", text: "The small pause isn't right yet." });
    }
    if (!agreed) return setStatus({ tone: "error", text: "Please agree before submitting." });

    setBusy(true);
    setStatus({ tone: null, text: "" });
    try {
      // >>> POST to your endpoint here.
      await new Promise((r) => setTimeout(r, 900));
      setStatus({
        tone: "ok",
        text: "You're on the list. We'll message you on WhatsApp when your night opens.",
      });
      formRef.current.reset();
      setNight(null);
      setAgreed(false);
    } catch {
      setStatus({ tone: "error", text: "That didn't send. Try again, or message us on WhatsApp." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="waitlist" className="relative px-5 pt-4 pb-20 sm:px-10 sm:pb-24" aria-label="The waitlist">
      <div className="relative mx-auto max-w-2xl" style={{ zIndex: "var(--z-content)" }}>
        <div className="text-center">
          <span className="label text-antique">
            <span className="text-mukut/70">02</span> &nbsp;·&nbsp; The waitlist
          </span>

          <RevealText
            lines={["Before the Chakra opens,", "there is the call."]}
            as="h2"
            className="display-type mt-4 text-[clamp(1.7rem,4vw,2.8rem)] leading-tight text-ivory"
            stagger={0.12}
          />

          <ScrollReveal className="mt-4">
            <p className="text-sm text-ivory/50 sm:text-base">
              Leave your name. Stay close. The rest will find you.
            </p>
          </ScrollReveal>

          <div className="divider-carved mt-7">
            <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
          </div>
        </div>

        <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-9 grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" id="w-name">
              <input id="w-name" name="name" type="text" autoComplete="name" className={inputCx} />
            </Field>
            <Field label="WhatsApp number" id="w-phone">
              <input id="w-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputCx} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" id="w-email">
              <input id="w-email" name="email" type="email" autoComplete="email" className={inputCx} />
            </Field>
            <Field label="Instagram handle" id="w-insta">
              <input id="w-insta" name="instagram" type="text" placeholder="@" className={inputCx} />
            </Field>
          </div>

          <div>
            <p className="label mb-1.5 text-ivory/50">Select one event date</p>
            <p className="mb-4 text-xs text-ivory/35">
              Only highlighted event dates can be selected.
            </p>
            <div className="frame-ancient bg-maroon/25 p-4 sm:p-6">
              <NightCalendar value={night} onChange={setNight} id="w-calendar" />
            </div>
            <p
              aria-live="polite"
              className={cx("mt-3 text-xs", night ? "text-mukut/90" : "text-ivory/35")}
            >
              {gateLine}
            </p>
          </div>

          <Field label="Why does the circle call you?" id="w-why">
            <textarea id="w-why" name="why" rows={3} placeholder="A small pause." className={cx(inputCx, "resize-y")} />
          </Field>

          <label className="flex items-start gap-3 text-xs leading-relaxed text-ivory/45 sm:text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 flex-none cursor-pointer appearance-none rounded-xs border border-antique/40 transition-colors checked:border-mukut checked:bg-mukut"
            />
            <span>
              I agree to the{" "}
              <a href={terms} target="_blank" rel="noreferrer noopener" className="text-mukut/90 underline underline-offset-2">Terms &amp; Conditions</a>{" "}
              and acknowledge the{" "}
              <a href={privacy} target="_blank" rel="noreferrer noopener" className="text-mukut/90 underline underline-offset-2">Privacy Policy</a>, including its
              data-retention practices, and the{" "}
              <a href={dataDeletion} target="_blank" rel="noreferrer noopener" className="text-mukut/90 underline underline-offset-2">Data Deletion</a>{" "}
              instructions, and I agree to receive my pass and essential updates on WhatsApp.
              Submitting an application does not guarantee a ticket.
            </span>
          </label>

          <Field label={`A small pause: ${sum.a} + ${sum.b} = ?`} id="w-pause">
            <input id="w-pause" name="pause" type="text" inputMode="numeric" className={cx(inputCx, "max-w-32")} />
          </Field>

          <div className="mt-1 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={busy}
              data-cursor="cta"
              className="rounded-full border border-mukut px-9 py-3.5 text-[0.72rem] tracking-[0.24em] text-mukut uppercase transition-colors duration-500 hover:bg-mukut hover:text-obsidian disabled:opacity-45"
            >
              {busy ? "Joining…" : "Join the waitlist"}
            </button>
            <button
              type="button"
              onClick={() =>
                navigator.share?.({ title: "Devi Garba", url: window.location.href })
              }
              className="label text-ivory/50 underline underline-offset-4 transition-colors hover:text-ivory"
            >
              Invite your people
            </button>
          </div>

          <p
            role="status"
            aria-live="polite"
            className={cx(
              "min-h-[1.4em] text-sm",
              status.tone === "error" ? "text-ember" : "text-mukut"
            )}
          >
            {status.text}
          </p>
        </form>
      </div>
    </section>
  );
}