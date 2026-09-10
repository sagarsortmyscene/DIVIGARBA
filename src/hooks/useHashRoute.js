import { useEffect, useState } from "react";


export function useHashRoute() {
  const read = () => window.location.hash.replace("#", "") || "top";
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      const next = read();
      setRoute(next);
      
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
