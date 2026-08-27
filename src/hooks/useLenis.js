import { useContext } from "react";
import { LenisContext } from "../components/providers/LenisContext";

/** Access the single Lenis instance — e.g. lenis.current?.scrollTo("#enter"). */
export const useLenis = () => useContext(LenisContext);
