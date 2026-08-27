import { NIGHTS, PRICING, PHASES, money } from "../../data/tickets";
import { EVENT_CONFIG } from "../../data/event";

/** The order, restated at every step so nothing is a surprise at payment. */
export function OrderSummary({ night, category, ticket, qty = 1 }) {
  const phase = PHASES.find((p) => p.id === ticket);
  const price = PRICING[category];
  const selected = NIGHTS.find((n) => n.id === night);
  if (!phase) return null;

  const unit = price[phase.id];
  const total = unit * qty;

  return (
    <aside className="frame-ancient bg-maroon/25 px-6 py-6" aria-label="Order summary">
      <h3 className="label text-mukut">Your order</h3>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ivory/45">Ticket</dt>
          <dd className="text-right text-ivory">{price.ticketName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ivory/45">Phase</dt>
          <dd className="text-right text-ivory">{phase.name} · {phase.phase}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ivory/45">Night</dt>
          <dd className="text-right text-ivory">
            {selected ? selected.label : `All ten nights · ${EVENT_CONFIG.dates}`}
          </dd>
        </div>
        {selected && (
          <div className="border-t border-antique/15 pt-3 text-xs text-ivory/45">
            <p>Gates open: {selected.gatesOpen}</p>
            <p className="mt-0.5">Gates close: {selected.gatesClose}</p>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-ivory/45">Passes</dt>
          <dd className="text-right text-ivory">× {qty}</dd>
        </div>
      </dl>

      <div className="divider-carved my-5">
        <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
      </div>

      <div className="flex items-baseline justify-between">
        <span className="label text-ivory/45">Total</span>
        <span className="display-type text-2xl text-mukut">{money(total)}</span>
      </div>
      <p className="mt-2 text-[0.68rem] text-ivory/30">
        Inclusive of all taxes. Passes are non-transferable.
      </p>
    </aside>
  );
}
