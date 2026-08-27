/* ============================================================
   LEGAL COPY — Terms, Privacy, and Data Deletion.
   Content lives here so the page components stay pure layout,
   same pattern as event.js / tickets.js.
   ============================================================ */
import { EVENT_CONFIG } from "./event";

const { brandLine, phone, email, dates } = EVENT_CONFIG;

export const TERMS = {
  title: "Terms & Conditions",
  intro: `${brandLine} is owned and operated by INCEPT EVENTS, a proprietorship registered in India.`,
  sections: [
    {
      heading: "Circle of Authenticity",
      bullets: [
        `Passes flow only through our official ${brandLine} channel: ${phone}.`,
        "Any entry sought with passes from elsewhere shall not be honoured — the Circle recognizes only what is truly aligned.",
      ],
    },
    {
      heading: "Entry into the Circle",
      bullets: [
        `The gates open only to those carrying a valid ${brandLine} pass.`,
        "Digital or printed passes must be presented for entry.",
        "Each pass is sacred and unique to the soul it belongs to — duplication, resale, or misuse shall break the flow and deny entry.",
        "All offerings (passes) are non-refundable and non-transferable.",
        "Tickets must be personalised at least 10 hours before the relevant event entry time. An unpersonalised ticket may be rendered unusable, and the organisers reserve the right to revoke it.",
        `The displayed ticket date is the event-night date. For the ${dates} event, gate entry begins at 12:00 AM (00:00) on the following calendar morning and closes at 7:00 AM that morning. A 19 October ticket therefore admits on 20 October from midnight until 7:00 AM.`,
      ],
    },
    {
      heading: "Age of Awakening",
      bullets: [
        "The Circle welcomes seekers aged 15 and above.",
        "Proof of age may be requested at the gate to honour this boundary.",
      ],
    },
    {
      heading: "Attire of the Earth",
      bullets: [
        "Entry is a celebration of tradition: cultural/ethnic attire is essential.",
        "The Circle reserves the right to turn away those not in resonance with this spirit.",
      ],
    },
    {
      heading: "Guardians of the Gate",
      bullets: [
        "Every being shall undergo respectful security checks before entering.",
        "The following have no place in the sacred space: weapons or harmful objects, alcohol, tobacco, or narcotics, and outside food or drink.",
        "Once you step out, the Circle shall not open again for re-entry.",
      ],
    },
    {
      heading: "Flow of Belongings",
      bullets: [
        "The Circle is not accountable for items lost or misplaced.",
        "Each seeker is asked to care for their belongings mindfully.",
      ],
    },
    {
      heading: "Companions",
      bullets: ["The Circle is a human gathering — pets cannot be accommodated inside."],
    },
    {
      heading: "Memory & Capture",
      bullets: [
        "Mobile photography and videography, for personal joy, are welcome.",
        "Professional cameras or recording equipment require prior written permission from the organizers.",
      ],
    },
    {
      heading: "Parking & Passage",
      bullets: [
        "Parking is at your own responsibility.",
        "The Circle does not carry liability for any loss or damage to vehicles or their contents.",
      ],
    },
    {
      heading: "Nourishment",
      bullets: ["Outside food or beverages shall not enter the Circle — curated offerings within will serve the flow."],
    },
    {
      heading: "Conduct of Resonance",
      bullets: [
        "Every seeker is expected to embody grace, respect, and harmony.",
        "Any act of disturbance, harassment, or disharmony shall lead to removal from the Circle without refund.",
        `Honour fellow seekers, performers, volunteers, and the custodians of ${brandLine}.`,
      ],
    },
    {
      heading: "If the Cosmos Shifts",
      bullets: [
        "Should unforeseen forces (weather, safety, or acts beyond control) intervene, the Circle may pause, reschedule, or close.",
        "Refunds shall only flow if announced by the organizers.",
      ],
    },
    {
      heading: "Disclaimer of the Circle",
      bullets: [
        "The organizers do not hold responsibility for personal injury, theft, or property damage.",
        "Entry into the Circle is at one's own choice and responsibility.",
      ],
    },
    {
      heading: `By entering ${brandLine}, you offer your consent to`,
      bullets: [
        "Flow with the Circle's harmony and abide by its sacred guidelines.",
        `Cooperate with the ${brandLine} Team at all times.`,
        `Allow your presence to be captured in memory (photography/videography) for the story and celebration of ${brandLine}.`,
      ],
    },
  ],
  footnote: `Event dates: ${dates}, Ahmedabad. Contact: ${phone}.`,
};

export const PRIVACY = {
  title: "Privacy Policy",
  effective: "19 August 2026",
  intro: `${brandLine} is owned and operated by INCEPT EVENTS, a proprietorship registered in India. This policy explains how we collect, use, share, protect, retain, and delete personal data when you use the ${brandLine} website, waitlist, ticketing services, event-entry systems, email communications, or WhatsApp communications.`,
  sections: [
    {
      heading: "Information We Collect",
      bullets: [
        "Identity and contact information: names, email addresses, mobile or WhatsApp numbers, gender, Instagram handles, reference details, motivations, selected event dates, and ticket personalisation details.",
        "Booking and event information: waitlist, booking and ticket references, ticket products, amounts, payment status, Razorpay transaction references, QR and admission activity, consent records, communication-delivery status, and support correspondence.",
        "Technical and security information: IP address, browser or device user agent, security logs, and a locally generated waitlist device seed and derived fingerprint used to prevent duplicate or abusive submissions.",
        "Optional analytics information: website activity sent through Meta Pixel only after you allow optional tracking.",
        "WhatsApp information: opt-in or revocation evidence, hashed or masked recipient identifiers, approved template and message status, provider message identifiers, and STOP or START choices.",
      ],
      paragraphs: [
        "Payment information is entered into Razorpay's secure checkout. INCEPT EVENTS does not receive or store your complete payment-card or banking credentials.",
      ],
    },
    {
      heading: "How We Use Information",
      bullets: [
        "Manage waitlist applications and communicate their status.",
        "Reserve passes, verify payments, issue tickets, and support personalisation.",
        "Deliver transactional email or consented WhatsApp notifications.",
        "Validate QR tickets, manage admission, and maintain event safety.",
        "Respond to support, correction, opt-out, grievance, and deletion requests.",
        "Prevent duplicate submissions, fraud, misuse, and security incidents.",
        "Meet accounting, dispute-resolution, and other legal obligations.",
        "Measure website and campaign performance only when optional tracking is allowed.",
      ],
    },
    {
      heading: "When Information Is Shared",
      paragraphs: [
        `We share only what is reasonably necessary with service providers that help us operate ${brandLine}, including Razorpay for payments, Meta and WhatsApp for consented messaging and optional analytics, Cloudflare for website delivery and security, our hosting and database providers, and our email-delivery provider.`,
        "Authorised INCEPT EVENTS staff and Community Partners may access limited information when required to review an application, allocate or support a ticket, or operate the event. We may also disclose information where required by law, to protect people or the event, or to investigate fraud or misuse. We do not sell personal data.",
      ],
    },
    {
      heading: "Optional Tracking and Necessary Storage",
      paragraphs: [
        'Meta Pixel is disabled unless you select "Allow optional tracking." You can reject it or change your choice at any time through "Privacy choices" in the footer. Rejecting optional tracking does not affect your ability to use the website, waitlist, or ticketing services.',
        "The site may still use necessary local or session storage for basic page behaviour, remembering that an introduction has been shown, and protecting the waitlist from duplicate or abusive submissions. These necessary functions do not enable Meta Pixel.",
      ],
    },
    {
      heading: "Data Retention",
      paragraphs: [
        "We keep personal data only for as long as it is reasonably needed to deliver the event and related services, maintain ticket and admission integrity, meet accounting or legal obligations, prevent fraud, resolve disputes, and demonstrate communication or consent choices.",
        "Waitlist and unsuccessful booking information is removed or anonymised when it is no longer needed for those purposes. Limited payment, ticket, admission, security, consent-revocation, and audit records may be retained where reasonably required. Following an approved deletion request, direct identifiers will be deleted or anonymised where feasible while the minimum necessary record is preserved.",
      ],
    },
    {
      heading: "Your Choices and Rights",
      paragraphs: [
        "You may ask to access or correct your information, withdraw optional consent, stop non-essential communications, raise a privacy grievance, or request deletion. For deletion steps, read our Data Deletion instructions.",
        `Contact us at ${email}. We may verify your identity before acting on a request.`,
      ],
    },
    {
      heading: "Young Attendees",
      paragraphs: [
        `${brandLine}'s entry terms welcome attendees aged 15 and above. If an attendee is under 18, a parent or legal guardian should submit or authorise the personal data used for waitlist, booking, ticket personalisation, or support purposes.`,
      ],
    },
    {
      heading: "Security, Providers, and Changes",
      paragraphs: [
        "We use reasonable administrative and technical safeguards and restrict access to people who need the information for an authorised purpose. No online system can be guaranteed completely secure. Some providers may process information in other countries under their own safeguards and terms.",
        "Third-party websites and services, including Razorpay, Meta, Instagram, WhatsApp, maps, and external links, have their own privacy practices. We may update this policy when our services, providers, or legal obligations change. The effective date above will identify the latest published version.",
      ],
    },
  ],
};

export const DATA_DELETION = {
  title: "Data Deletion",
  effective: "19 August 2026",
  intro: "Your information, your choice.",
  sections: [
    {
      heading: "How to Request Deletion",
      bullets: [
        `Email ${email} with the subject "Data Deletion Request — ${brandLine}."`,
        `Send the request from the email address used with ${brandLine} where possible.`,
        "Include your full name, the email address used for services, the last four digits of your mobile/WhatsApp number, and any relevant booking or ticket reference numbers.",
        "Never send us a password, OTP, complete card number, CVV, UPI PIN, or banking credential.",
      ],
    },
    {
      heading: "Verification and Timing",
      bullets: [
        "We may request additional information to verify the requester's identity.",
        "After verification, INCEPT EVENTS will complete deletion or anonymisation within 30 days and confirm completion by email.",
        "If you don't receive an acknowledgement within seven days, please follow up.",
      ],
    },
    {
      heading: "What We Delete or Anonymise",
      bullets: [
        `Personal identifiers are removed from ${brandLine} systems we control, across the website, waitlist, ticketing, and communication channels.`,
        "Optional communications are stopped and opt-outs are recorded.",
        "Certain records related to accounting, legal compliance, fraud prevention, and security may be retained, with direct identifiers removed where feasible.",
      ],
    },
    {
      heading: "Third-Party Data",
      bullets: [
        "Third-party services such as Razorpay, Meta, WhatsApp, and Instagram maintain their own data under separate privacy policies.",
        "You may need to contact those services independently for deletion requests they control.",
      ],
    },
  ],
  footnote: `For inquiries, reach out via phone at ${phone} or email at ${email}.`,
};
