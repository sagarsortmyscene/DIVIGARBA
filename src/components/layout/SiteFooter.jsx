import { Phone, Mail, MapPin } from "lucide-react";
import { EVENT_CONFIG } from "../../data/event";
import { SectionPlate } from "./SectionPlate";

/**
 * The Instagram glyph, drawn here rather than imported: lucide-react 1.x
 * dropped its brand icons, so there is no `Instagram` export any more.
 * Same 24x24 viewBox, same currentColor stroke and the same `size` /
 * `strokeWidth` props as the lucide icons beside it, so it lines up
 * with them and inherits the identical antique-gold colour.
 */
function InstagramIcon({ size = 24, strokeWidth = 2, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * `contacts` is off on the legal pages. The phone, email, Instagram and
 * map row belongs on the landing page; on Terms it reads as an invite
 * to get in touch in the middle of a legal document, and it was showing
 * there only because those pages render this same footer.
 */
export function SiteFooter({ contacts: showContacts = true }) {
  const {
    brandLine, phone, email, instagram, instagramHandle, maps,
    terms,
    organiserName, organiserUrl,
  } = EVENT_CONFIG;

  const contacts = [
    { Icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { Icon: Mail, label: email, href: `mailto:${email}` },
    { Icon: InstagramIcon, label: instagramHandle, href: instagram },
    { Icon: MapPin, label: "Find your way", href: maps },
  ];

  /* Terms only. Privacy, Data Deletion and Privacy choices came out of
     this row by request. The PAGES are untouched and still reachable
     at #privacy, #data-deletion and #privacy-choices — they simply are
     not linked from the footer any more. */
  const legal = [["T&Cs", terms]];

  return (
    <footer
      id="footer"
      className="relative overflow-hidden px-5 pt-10 pb-10 sm:px-10"
      style={{ zIndex: "var(--z-content)" }}
    >
      <SectionPlate />

      {/* Both of these needed `relative` and a layer. The footer's
          children were static, and a static element paints UNDER a
          positioned sibling however high its z-index — so without this
          the plate above would cover the whole footer. */}
      <div className="divider-carved relative mb-10" style={{ zIndex: "var(--z-content)" }}>
        <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
      </div>

      <div className="relative mx-auto max-w-5xl" style={{ zIndex: "var(--z-content)" }}>
        {/* Four framed tiles, dressed exactly like the About block —
            `frame-ancient` plus `bg-maroon/25` — instead of the opaque
            obsidian panels with hairline gaps that were here.

            The old grid drew its dividers with `gap-px` over a
            `bg-antique/15` backing, which only works while the tiles
            are OPAQUE: at maroon/25 that backing would show straight
            through every tile and tint the lot. Giving each tile its
            own frame and using real gaps removes the problem rather
            than fighting it, and matches About besides. */}
        {showContacts && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map(({ Icon, label, href }) => (
              <li key={label} className="frame-ancient bg-maroon/25">
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="flex flex-col items-center gap-2 px-4 py-5 text-ivory/60 transition-colors hover:text-ivory"
                >
                  <Icon size={16} strokeWidth={1.2} className="text-antique" aria-hidden />
                  <span className="text-sm">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* The date-and-address line that sat here is gone: the Find us
            section above already carries the venue, and the "Find your
            way" link in the row above this one still opens the map. */}
        <div className={`flex flex-wrap items-center justify-center gap-3 ${showContacts ? "mt-8" : "mt-0"}`}>
          {legal.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="label rounded-full border border-antique/20 px-4 py-2 text-ivory/45 transition-colors hover:border-antique/50 hover:text-ivory"
            >
              {label}
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-ivory/70">
          {brandLine.split(" ").slice(0, 2).join(" ")} organised by{" "}
          {organiserUrl ? (
            <a href={organiserUrl} target="_blank" rel="noreferrer noopener" className="text-mukut hover:text-mukut">
              {organiserName}
            </a>
          ) : (
            /* No URL configured — the name still reads as the credit,
               just without a dead link wrapped around it. */
            <span className="text-mukut">{organiserName}</span>
          )}
          .
        </p>

        <p className="mt-3 text-center text-sm text-ivory/70">
          {/* No year: it was hardcoded to 2026, so it would have gone
              stale on its own. One claim now covers both the images
              and the words. */}
          All photographs and content owned by {brandLine}.
        </p>
      </div>
    </footer>
  );
}