/* Change the event here. No component holds a hard-coded date. */
export const EVENT_CONFIG = {
  name: "Divi Garba",
  dates: "11 — 20 October 2026",
  location: "Master Farm, B/s Sardardham, Vaishnodevi Circle",

  /* The same address, split for the Find us panel: a headline name and
     the street line under it.
     Corrected to the Google listing for "Divi Garba 2026". The site
     previously said "B/s Sardardham, Vaishnodevi Circle", which is a
     different part of Ahmedabad entirely — so the printed address and
     the map pin were pointing people to two different places. */
  venueName: "Master Farm",
  venueStreet: "B/s Sardardham, Vaishnodevi Circle",


  gateEntry: "8:00 PM",
  entryCloses: "2:00 AM",

  /* The calendar highlights exactly these nights. */
  year: 2026,
  month: 9,               // 0-indexed: 9 = October
  openNights: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],

  phone: "+91 99797 87914",
  email: "panchatva@divigarba.com",
  instagram: "https://www.instagram.com/divigarba/",
  instagramHandle: "@divigarba",
  /* The share link for the venue. Opened in a new tab by the "Open in
     maps" button and the footer link, where it works perfectly. */
  maps: "https://share.google/TpbhF5qgcvUpwjPHC",

  /* The map FRAME cannot use the link above, and this is measured
     rather than assumed: share.google 302s to google.com/search, which
     answers with `X-Frame-Options: SAMEORIGIN`, so an iframe pointed at
     it renders blank. A full /maps/place/ URL with output=embed
     appended returns SAMEORIGIN too. Only the documented ?q= form comes
     back without that header, so it is the one shape a frame accepts.

     The coordinates are the venue's own, read out of the place URL for
     this same listing (both carry kgmid /g/11w98wzdgk), so the frame
     and the button show the same spot — one is simply the only form
     Google will let us embed. */
  /* Coordinates ONLY. Two things were tried and both failed:
       q=lat,lng+(Label)  renders the map but asks Google to resolve
                          place info for the label, and when that
                          lookup fails the frame shows a
                          "Place info couldn't load" card over it.
       /maps/place/ URL   answers X-Frame-Options: SAMEORIGIN, so it
                          cannot be framed at all.
     A bare coordinate pair is the one form that renders cleanly every
     time. It drops an unnamed marker, so the venue name is printed
     over the frame by VenueSection instead — under our control, and
     it cannot fail to load. */
  mapEmbed: "https://www.google.com/maps?q=23.1427868,72.5244871&z=16&output=embed",
  terms: "#terms",

  /* Who runs the event. This is the ONLY place the name is written:
     the footer credit and every mention across the Terms, Privacy and
     Data Deletion pages read it from here, so the five hardcoded
     "INCEPT EVENTS" strings that used to sit in legal.js cannot drift
     out of step with the footer again.
     `organiserUrl` is null because no site was given — the footer
     renders plain text when it is empty and a link when it is set, so
     adding a URL here is all that is needed to make it clickable. */
  organiserName: "Panchatva Events",
  organiserUrl: null,
  brandLine: "Divi Garba",
  venue: "Divi Garba — VAYANA",
};
