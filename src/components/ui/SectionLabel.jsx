import { cx } from "../../lib/utils";

/** 01 — DARSHAN. The chapter marker used across every section. */
export function SectionLabel({ number, label, className, tone = "text-antique", ...rest }) {
  return (
    <div {...rest} className={cx("flex items-center gap-4 label", tone, className)}>
      {number && <span className="opacity-70">{number}</span>}
      <span aria-hidden className="h-px w-8 bg-current opacity-40" />
      <span>{label}</span>
    </div>
  );
}
