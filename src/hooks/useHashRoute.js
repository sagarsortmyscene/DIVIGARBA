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
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
