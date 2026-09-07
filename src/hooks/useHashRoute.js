import { useEffect, useState } from "react";

/**
 * Two-page routing without a router. The project has exactly two views,
 * so pulling in react-router would add a dependency and a build layer
 * to solve a problem `hashchange` already solves.
 */
export function useHashRoute() {
  const read = () => window.location.hash.replace("#", "") || "top";
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      const next = read();
      setRoute(next);
      /* Land on the matching anchor if the newly rendered view has one
         (the legal pages' "return to the circle" points at #footer), and
         only fall back to the top when there is nothing to land on.
         Deferred a frame because that element does not exist until the
         view this hash switches to has actually rendered. */
      requestAnimationFrame(() => {
        const target = document.getElementById(next);
        if (target) target.scrollIntoView();
        else window.scrollTo({ top: 0 });
      });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
