import { EVENT_CONFIG } from "../../data/event";
import { cx } from "../../lib/utils";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/**
 * Month grid where only the event nights are reachable.
 * Everything else renders as a real disabled button, so keyboard
 * users tab straight across the dead days.
 */
export function NightCalendar({ value, onChange, id }) {
  const { year, month, openNights } = EVENT_CONFIG;

  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];

  return (
    <div id={id} role="group" aria-label={`${MONTHS[month]} ${year} — choose an event night`}>
      <p className="label mb-4 text-antique">
        {MONTHS[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DOW.map((d, i) => (
          <span key={i} className="pb-2 text-[0.6rem] tracking-[0.2em] text-ivory/30" aria-hidden>
            {d}
          </span>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <span key={`b${i}`} aria-hidden />;
          const open = openNights.includes(day);
          const active = value === day;

          return (
            <button
              key={day}
              type="button"
              disabled={!open}
              aria-pressed={active}
              aria-label={
                open ? `Night of ${day} ${MONTHS[month]}` : `${day} ${MONTHS[month]}, unavailable`
              }
              onClick={() => onChange(day)}
              className={cx(
                "aspect-square rounded-sm border text-sm transition-all duration-300",
                !open && "cursor-not-allowed border-transparent text-ivory/15",
                open && !active && "border-antique/35 text-mukut hover:border-mukut hover:bg-mukut/10",
                active && "border-mukut bg-mukut font-medium text-obsidian"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
