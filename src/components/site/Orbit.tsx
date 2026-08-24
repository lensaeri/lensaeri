import type { CSSProperties } from "react";

/** Decorative concentric-ring ornament used on the interior page headers. */
export function Orbit({ style }: { style?: CSSProperties }) {
  return (
    <div className="orbit" aria-hidden="true" style={style}>
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
