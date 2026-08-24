"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import { Flash, SaveButton } from "@/components/admin/SaveBar";

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(signIn, null);

  return (
    <form action={action}>
      <Flash state={state} />
      <input type="hidden" name="next" value={next} />

      <label className="f">
        <span>Email</span>
        <input type="email" name="email" autoComplete="email" required autoFocus />
      </label>

      <label className="f">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>

      <SaveButton label="Sign in" className="b b--solid" />
    </form>
  );
}
