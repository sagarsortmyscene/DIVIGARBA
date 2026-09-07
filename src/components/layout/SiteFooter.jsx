import { Phone, Mail, AtSign, MapPin } from "lucide-react";
import { EVENT_CONFIG } from "../../data/event";

export function SiteFooter() {
  const {
    brandLine, phone, email, instagram, instagramHandle, maps,
    dates, location, terms, privacy, dataDeletion,
    organiserName, organiserUrl,
  } = EVENT_CONFIG;

  const contacts = [
    { Icon: Phone, label: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { Icon: Mail, label: email, href: `mailto:${email}` },
    { Icon: AtSign, label: instagramHandle, href: instagram },
    { Icon: MapPin, label: "Find your way", href: maps },
  ];

  const legal = [
    ["T&Cs", terms],
    ["Privacy", privacy],
    ["Data Deletion", dataDeletion],
    ["Privacy choices", "#privacy-choices"],
  ];

  return (
    <footer
      id="footer"
      className="relative px-5 pb-10 sm:px-10"
      style={{ zIndex: "var(--z-content)" }}
    >
      <div className="divider-carved mb-10"><span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" /></div>

      <div className="mx-auto max-w-5xl">
        <ul className="grid gap-px border border-antique/15 bg-antique/15 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map(({ Icon, label, href }) => (
            <li key={label} className="bg-obsidian/90">
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

        <p className="label mt-7 text-center text-sm text-ivory/75">
          {dates} · {location}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
          {brandLine.split(" ").slice(0, 2).join(" ")} is a Navratri experience by{" "}
          <a href={organiserUrl} target="_blank" rel="noreferrer noopener" className="text-mukut hover:text-mukut">
            {organiserName}
          </a>
          .
        </p>

        <p className="mt-3 text-center text-sm text-ivory/70">
          All photographs are owned by {brandLine}. © 2026 {brandLine}.
        </p>
      </div>
    </footer>
  );
}