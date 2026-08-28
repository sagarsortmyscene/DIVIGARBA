import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Ties a <video>'s currentTime to scroll progress through `sectionRef`,
 * so the film scrubs forward and back exactly like everything else on
 * the page. Falls back gracefully — `failed` flips true if the source
 * never loads (no file dropped in yet, or a real network error), so
 * the caller can show a poster instead of a permanently blank frame.
 */
export function useScrollVideo(videoRef, sectionRef, { enabled = true } = {}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  /* Track load state independent of scrubbing — a poster still needs
     to know whether the video is usable even when `enabled` is false. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onError = () => setFailed(true);
    const onLoaded = () => setReady(true);
    video.addEventListener("error", onError);
    video.addEventListener("loadedmetadata", onLoaded);

    // A missing/unresolvable src doesn't always fire `error` promptly —
    // if nothing has loaded after a few seconds, treat it as failed
    // rather than leaving the poster hidden behind a frame that never paints.
    const giveUp = setTimeout(() => {
      if (video.readyState === 0) setFailed(true);
    }, 4000);

    return () => {
      video.removeEventListener("error", onError);
      video.removeEventListener("loadedmetadata", onLoaded);
      clearTimeout(giveUp);
    };
  }, [videoRef]);

  /* The actual scrub — a plain ScrollTrigger writing currentTime directly,
     not a gsap tween: video.currentTime isn't a tweenable property GSAP
     understands natively, and scrubbing wants the exact scroll-derived
     time each frame, not an eased approach toward it. */
  useEffect(() => {
    if (!enabled || failed) return;
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let trigger;
    const setup = () => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          const t = self.progress * video.duration;
          if (Number.isFinite(t)) video.currentTime = t;
        },
      });
    };

    if (video.readyState >= 1) setup();
    else video.addEventListener("loadedmetadata", setup, { once: true });

    return () => {
      trigger?.kill();
      video.removeEventListener("loadedmetadata", setup);
    };
  }, [enabled, failed, videoRef, sectionRef]);

  return { ready, failed };
}
