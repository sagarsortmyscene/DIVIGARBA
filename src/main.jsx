import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./styles/globals.css";
import App from "./App.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* On a real phone, reloading or revisiting this tab restores the last
   scroll position by default — so the gate's "grow from centre" moment
   (which only plays near the very top) gets skipped entirely on a
   second load, while it never happens in a fresh DevTools session.
   Force every load to start at the top instead. Must run before
   ScrollTrigger measures anything, so it's here, ahead of React. */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
