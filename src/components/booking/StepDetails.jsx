import { cx } from "../../lib/utils";

const inputCx =
  "w-full border-b border-antique/25 bg-transparent py-3 text-base font-light text-ivory transition-colors duration-300 outline-none placeholder:text-ivory/25 focus:border-mukut";

function Field({ label, id, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-2 block text-ivory/50">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ivory/35">{hint}</p>}
    </div>
  );
}

/** Step 2 — who is coming. Quantity lives here because it changes the total. */
export function StepDetails({ values, onChange, qty, onQty, maxQty, errors }) {
  const set = (k) => (e) => onChange({ ...values, [k]: e.target.value });

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" id="b-name">
          <input id="b-name" value={values.name} onChange={set("name")} autoComplete="name" className={inputCx} />
        </Field>
        <Field label="WhatsApp number" id="b-phone" hint="Your pass is delivered here.">
          <input id="b-phone" value={values.phone} onChange={set("phone")} type="tel" inputMode="tel" autoComplete="tel" className={inputCx} />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Email" id="b-email">
          <input id="b-email" value={values.email} onChange={set("email")} type="email" autoComplete="email" className={inputCx} />
        </Field>
        <Field label="Number of passes" id="b-qty" hint={`Up to ${maxQty} per booking.`}>
          <div className="flex items-center gap-4 py-2">
            <button
              type="button"
              onClick={() => onQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              aria-label="One fewer pass"
              className="grid h-9 w-9 place-items-center rounded-full border border-antique/35 text-ivory transition-colors hover:border-mukut disabled:opacity-30"
            >
              −
            </button>
            <span id="b-qty" aria-live="polite" className="display-type w-8 text-center text-xl text-ivory">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => onQty(Math.min(maxQty, qty + 1))}
              disabled={qty >= maxQty}
              aria-label="One more pass"
              className="grid h-9 w-9 place-items-center rounded-full border border-antique/35 text-ivory transition-colors hover:border-mukut disabled:opacity-30"
            >
              +
            </button>
          </div>
        </Field>
      </div>

      <Field label="Instagram handle (optional)" id="b-insta">
        <input id="b-insta" value={values.instagram} onChange={set("instagram")} placeholder="@" className={inputCx} />
      </Field>

      {errors && <p className="text-sm text-ember">{errors}</p>}

      <p className={cx("text-xs leading-relaxed text-ivory/35")}>
        Names on passes are checked at the gate. Please use the name on the ID you will carry.
      </p>
    </div>
  );
}
