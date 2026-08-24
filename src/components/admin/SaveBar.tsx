"use client";

import { useFormStatus } from "react-dom";

export function SaveButton({
  label = "Save",
  className = "b b--solid",
}: {
  label?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ActionButton({
  label,
  pendingLabel,
  className = "b",
  confirm,
}: {
  label: string;
  pendingLabel?: string;
  className?: string;
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending ? (pendingLabel ?? "Working…") : label}
    </button>
  );
}

export function Flash({ state }: { state: { ok?: string; error?: string } | null }) {
  if (!state) return null;
  if (state.error) return <div className="flash flash--error">{state.error}</div>;
  if (state.ok) return <div className="flash">{state.ok}</div>;
  return null;
}
