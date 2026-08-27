import { useMemo, useState } from "react";
import { EVENT_CONFIG } from "../../data/event";
import { NIGHTS, CATEGORIES, PHASES, PRICING, money, STATUS_LABEL } from "../../data/tickets";
import { SiteFooter } from "../layout/SiteFooter";
import { OrderSummary } from "./OrderSummary";
import { StepDetails } from "./StepDetails";
import { StepPayment } from "./StepPayment";
import { cx } from "../../lib/utils";

const STEPS = ["Pass", "Details", "Payment"];
const ALL = "all";

/** Segmented chip used by both the date row and the category row. */
function Chip({ active, disabled, onClick, children, className }) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "rounded-full border px-4 py-2.5 text-xs whitespace-nowrap transition-all duration-400",
        disabled && "cursor-not-allowed border-antique/10 text-ivory/20",
        !disabled && !active && "border-antique/30 text-ivory/70 hover:border-mukut/70 hover:text-ivory",
        active && "border-mukut bg-mukut font-medium text-obsidian",
        className
      )}
    >
      {children}
    </button>
  );
}

export function BookingPage() {
  const { name, brandLine, venue, dates, location } = EVENT_CONFIG;

  const [step, setStep] = useState(0);
  const [night, setNight] = useState(NIGHTS[0].id);
  const [category, setCategory] = useState("individual");
  const [ticket, setTicket] = useState(null);
  const [qty, setQty] = useState(1);
  const [details, setDetails] = useState({ name: "", phone: "", email: "", instagram: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  /* A season pass isn't tied to one night, and a single night can't be
     bought as a season pass — so the two controls constrain each other
     rather than letting you build an impossible order. */
  const seasonOnly = night === ALL;
  const activeCategory = seasonOnly ? "season" : category;

  const selectedNight = useMemo(
    () => NIGHTS.find((n) => n.id === night) ?? null,
    [night]
  );

  const price = PRICING[activeCategory];

  function chooseNight(id) {
    setNight(id);
    setTicket(null);
    if (id === ALL) setCategory("season");
  }

  function chooseCategory(id) {
    setCategory(id);
    setTicket(null);
    if (id === "season") setNight(ALL);
    else if (night === ALL) setNight(NIGHTS[0].id);
  }

  const chosen = PHASES.find((p) => p.id === ticket);

  function next() {
    if (step === 0) {
      if (!chosen) return;
      setError("");
      return setStep(1);
    }
    /* Step 1 -> 2: the gate needs a real name and a reachable number,
       so this is validated here rather than at the payment screen. */
    if (!details.name.trim()) return setError("Add the name that will be on the pass.");
    if (!/^[\d\s+()-]{8,}$/.test(details.phone)) return setError("Add a valid WhatsApp number.");
    if (!/^\S+@\S+\.\S+$/.test(details.email)) return setError("Add a valid email.");
    setError("");
    setStep(2);
  }

  async function handlePaid() {
    setBusy(true);
    try {
      /* >>> WIRE YOUR GATEWAY HERE.
         Create the order SERVER-side and re-derive the price there —
         never trust an amount posted from the browser. */
      await new Promise((r) => setTimeout(r, 1100));
      setDone("DG-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-svh">
      {/* ── slim booking header ── */}
      <header
        className="sticky top-0 flex items-center justify-between border-b border-antique/15 bg-obsidian/90 px-5 py-4 backdrop-blur-md sm:px-10"
        style={{ zIndex: "var(--z-nav)" }}
      >
        <a href="#top" className="label text-ivory/60 transition-colors hover:text-ivory">
          ← Return to the circle
        </a>
        <span className="label text-mukut">Book now</span>
      </header>

      <main className="px-5 pt-12 pb-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="display-type text-center text-[clamp(1.9rem,5vw,3.2rem)] text-ivory">
            Your place in the circle
          </h1>
          <p className="mx-auto mt-4 max-w-[54ch] text-center text-sm text-ivory/55">
            Choose your event night, ticket category, and pass. Every public price is shown
            clearly; only the currently live offer can be reserved.
          </p>
          <p className="mx-auto mt-3 max-w-[58ch] text-center text-xs text-ivory/35">
            Selectable dates are event-night dates. Every ticket shows its exact Gates Open
            and Gates Close calendar date before payment.
          </p>

          {/* ── stepper ── */}
          <ol className="mt-10 flex items-center justify-center gap-3 sm:gap-5">
            {STEPS.map((label, i) => {
              const current = i === step;
              const cleared = i < step;
              return (
                <li key={label} className="flex items-center gap-3 sm:gap-5">
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cx(
                        "grid h-7 w-7 place-items-center rounded-full border text-xs transition-colors duration-400",
                        current && "border-mukut bg-mukut text-obsidian",
                        cleared && "border-mukut/60 text-mukut",
                        !current && !cleared && "border-antique/30 text-ivory/40"
                      )}
                      aria-current={current ? "step" : undefined}
                    >
                      {cleared ? "✓" : i + 1}
                    </span>
                    <span className={cx("label", current ? "text-ivory" : cleared ? "text-mukut/70" : "text-ivory/35")}>
                      {label}
                    </span>
                  </span>
                  {i < STEPS.length - 1 && <span aria-hidden className="h-px w-6 bg-antique/25 sm:w-10" />}
                </li>
              );
            })}
          </ol>

          {/* ── event summary bar ── */}
          <dl className="frame-ancient mt-10 grid gap-px border-antique/20 bg-antique/12 sm:grid-cols-3">
            {[
              ["Event nights", `${dates.replace("—", "to")}`],
              ["Event", brandLine.toUpperCase()],
              ["Venue", venue ?? location],
            ].map(([k, v]) => (
              <div key={k} className="bg-obsidian/90 px-5 py-4">
                <dt className="label text-ivory/35">{k}</dt>
                <dd className="mt-1.5 text-sm text-ivory">{v}</dd>
              </div>
            ))}
          </dl>

          {step === 0 && (
            <>
              {/* ── 1 · date ── */}
              <section className="mt-12" aria-labelledby="s-date">
                <h2 id="s-date" className="label mb-4 text-mukut">1 &nbsp;·&nbsp; Choose your date</h2>
                <div className="flex flex-wrap gap-2">
                  {NIGHTS.map((n) => (
                    <Chip key={n.id} active={night === n.id} onClick={() => chooseNight(n.id)}>
                      {n.label}
                    </Chip>
                  ))}
                  <Chip active={night === ALL} onClick={() => chooseNight(ALL)} className="border-dashed">
                    All event nights
                  </Chip>
                </div>
              </section>

              {/* ── 2 · category ── */}
              <section className="mt-10" aria-labelledby="s-cat">
                <h2 id="s-cat" className="label mb-4 text-mukut">2 &nbsp;·&nbsp; Choose your ticket category</h2>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c.id}
                      active={activeCategory === c.id}
                      disabled={seasonOnly && c.id !== "season"}
                      onClick={() => chooseCategory(c.id)}
                    >
                      {c.label}
                    </Chip>
                  ))}
                </div>
                <p className="mt-3 text-xs text-ivory/35">
                  {seasonOnly
                    ? "A season pass covers every event night, so no single date is selected."
                    : CATEGORIES.find((c) => c.id === activeCategory)?.blurb}
                </p>
              </section>

              {/* ── 3 · ticket ── */}
              <section className="mt-10" aria-labelledby="s-ticket">
                <h2 id="s-ticket" className="label mb-4 text-mukut">3 &nbsp;·&nbsp; Choose your ticket</h2>
                <ul className="grid gap-3">
                  {PHASES.map((p) => {
                    const live = p.status === "live";
                    const selected = ticket === p.id;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          disabled={!live}
                          aria-pressed={selected}
                          onClick={() => setTicket(p.id)}
                          className={cx(
                            "frame-ancient w-full px-5 py-5 text-left transition-all duration-500 sm:px-7",
                            !live && "cursor-not-allowed opacity-45",
                            live && !selected && "hover:border-mukut/60",
                            selected && "border-mukut bg-mukut/8"
                          )}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="display-type text-xl text-ivory">
                                {p.name} <span className="text-ivory/45">({p.phase})</span>
                              </p>
                              <p className="mt-1 text-sm text-mukut/80">{price.ticketName}</p>
                              {selectedNight ? (
                                <div className="mt-3 space-y-0.5 text-xs text-ivory/50">
                                  <p className="text-ivory/70">{selectedNight.label}</p>
                                  <p>Gates open: {selectedNight.gatesOpen}</p>
                                  <p>Gates close: {selectedNight.gatesClose}</p>
                                </div>
                              ) : (
                                <p className="mt-3 text-xs text-ivory/50">
                                  Valid on all ten event nights · {dates}
                                </p>
                              )}
                              <p className="mt-3 text-xs text-ivory/40">{price.grants}</p>
                            </div>
                            <div className="text-right">
                              <p className="display-type text-2xl text-ivory">{money(price[p.id])}</p>
                              <p className={cx("label mt-1.5", live ? "text-mukut" : "text-ivory/30")}>
                                {STATUS_LABEL[p.status]}
                              </p>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </>
          )}

          {/* ── steps 2 and 3, with the order restated alongside ── */}
          {step > 0 && !done && (
            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
              <div>
                <h2 className="label mb-6 text-mukut">
                  {step === 1 ? "Your details" : "Payment"}
                </h2>

                {step === 1 && (
                  <StepDetails
                    values={details}
                    onChange={setDetails}
                    qty={qty}
                    onQty={setQty}
                    maxQty={activeCategory === "group" ? 4 : 8}
                    errors={error}
                  />
                )}

                {step === 2 && (
                  <StepPayment
                    category={activeCategory}
                    ticket={ticket}
                    qty={qty}
                    details={details}
                    busy={busy}
                    onPaid={handlePaid}
                  />
                )}
              </div>

              <OrderSummary night={night} category={activeCategory} ticket={ticket} qty={qty} />
            </div>
          )}

          {/* ── confirmation ── */}
          {done && (
            <div className="frame-ancient frame-pips mt-12 bg-maroon/25 px-6 py-14 text-center sm:px-14">
              <p className="label text-mukut">You are in the circle</p>
              <h2 className="display-type mt-4 text-[clamp(1.6rem,4vw,2.6rem)] text-ivory">
                Your pass is on its way.
              </h2>
              <p className="mx-auto mt-4 max-w-[44ch] text-sm text-ivory/55">
                We have sent it to {details.phone || "your WhatsApp"}. Carry the ID matching
                the name on the pass — it is checked at the gate.
              </p>
              <p className="label mt-8 text-ivory/40">Reference {done}</p>
              <a
                href="#top"
                className="label mt-10 inline-block rounded-full border border-mukut px-8 py-3 text-mukut transition-colors hover:bg-mukut hover:text-obsidian"
              >
                Return to the circle
              </a>
            </div>
          )}

          {/* ── step navigation ── */}
          {!done && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => { setError(""); setStep(step - 1); }}
                    className="label text-ivory/50 underline underline-offset-4 transition-colors hover:text-ivory"
                  >
                    ← Back
                  </button>
                )}
                <p className="text-xs text-ivory/40" aria-live="polite">
                  {step === 0
                    ? chosen
                      ? `${chosen.name} · ${price.ticketName} · ${money(price[chosen.id])}`
                      : "Select an available ticket to continue."
                    : error || ""}
                </p>
              </div>

              {step < 2 && (
                <button
                  type="button"
                  onClick={next}
                  disabled={step === 0 && !chosen}
                  className="rounded-full border border-mukut px-9 py-3.5 text-[0.72rem] tracking-[0.24em] text-mukut uppercase transition-colors duration-500 hover:bg-mukut hover:text-obsidian disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
