import { useState } from "react";
import { EVENT_CONFIG } from "../../data/event";
import { PRICING, PHASES, money } from "../../data/tickets";

const METHODS = [
  { id: "upi", label: "UPI", note: "GPay · PhonePe · Paytm" },
  { id: "card", label: "Card", note: "Visa · Mastercard · RuPay" },
  { id: "netbanking", label: "Net banking", note: "All major banks" },
];

/** Step 3 — confirm and pay. */
export function StepPayment({ category, ticket, qty, details, onPaid, busy }) {
  const { terms, privacy } = EVENT_CONFIG;
  const [method, setMethod] = useState("upi");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const phase = PHASES.find((p) => p.id === ticket);
  const total = PRICING[category][phase.id] * qty;

  function pay() {
    if (!agreed) return setError("Please accept the terms before paying.");
    setError("");
    onPaid(method);
  }

  return (
    <div className="grid gap-7">
      <div>
        <h3 className="label mb-4 text-mukut">Payment method</h3>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={method === m.id}
              onClick={() => setMethod(m.id)}
              className={`frame-ancient px-4 py-4 text-left transition-all duration-400 ${
                method === m.id ? "border-mukut bg-mukut/8" : "hover:border-mukut/60"
              }`}
            >
              <p className="text-sm text-ivory">{m.label}</p>
              <p className="mt-1 text-[0.68rem] text-ivory/40">{m.note}</p>
            </button>
          ))}
        </div>
      </div>

      <dl className="space-y-2 border-t border-antique/15 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ivory/45">Booking for</dt>
          <dd className="text-right text-ivory">{details.name || "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ivory/45">Pass sent to</dt>
          <dd className="text-right text-ivory">{details.phone || "—"}</dd>
        </div>
      </dl>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-ivory/45">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none cursor-pointer appearance-none rounded-xs border border-antique/40 transition-colors checked:border-mukut checked:bg-mukut"
        />
        <span>
          I accept the{" "}
          <a href={terms} target="_blank" rel="noreferrer noopener" className="text-mukut/90 underline underline-offset-2">Terms &amp; Conditions</a>{" "}
          and the{" "}
          <a href={privacy} target="_blank" rel="noreferrer noopener" className="text-mukut/90 underline underline-offset-2">Privacy Policy</a>.
          Passes are non-refundable and non-transferable.
        </span>
      </label>

      {error && <p className="text-sm text-ember">{error}</p>}

      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="justify-self-start rounded-full border border-mukut px-9 py-3.5 text-[0.72rem] tracking-[0.24em] text-mukut uppercase transition-colors duration-500 hover:bg-mukut hover:text-obsidian disabled:opacity-40"
      >
        {busy ? "Opening gateway…" : `Pay ${money(total)}`}
      </button>

      <p className="text-[0.68rem] text-ivory/30">
        {/* >>> WIRE YOUR GATEWAY in BookingPage.handlePaid() — Razorpay/Stripe order
            creation must happen server-side; never trust a price sent from here. */}
        You will be redirected to a secure payment page.
      </p>
    </div>
  );
}
