import { Phone, Mail, MapPin } from "lucide-react";
import { EVENT_CONFIG } from "../../data/event";
import { SectionPlate } from "./SectionPlate";


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

  
  const legal = [["T&Cs", terms]];

  return (
    <footer
      id="footer"
      className="relative overflow-hidden px-5 pt-10 pb-10 sm:px-10"
      style={{ zIndex: "var(--z-content)" }}
    >
      <SectionPlate />

      
      <div className="divider-carved relative mb-10" style={{ zIndex: "var(--z-content)" }}>
        <span className="h-1.5 w-1.5 rotate-45 bg-mukut/70" />
      </div>

      <div className="relative mx-auto max-w-5xl" style={{ zIndex: "var(--z-content)" }}>
        
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
            
            <span className="text-mukut">{organiserName}</span>
          )}
          .
        </p>

        <p className="mt-3 text-center text-sm text-ivory/70">
          
          All photographs and content owned by {brandLine}.
        </p>
      </div>
    </footer>
  );
}
