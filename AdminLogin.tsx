"use client";

import { useActionState } from "react";
import { adminLogin, type FormState } from "@/app/actions";

export function AdminLogin() {
  const [state, action, pending] = useActionState(adminLogin, { status: "idle" } as FormState);
  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="h-display text-2xl text-brand-deep">Beta admin</h1>
      <form action={action} className="mt-6 space-y-4">
        <div>
          <label htmlFor="pw" className="label">Password</label>
          <input id="pw" name="password" type="password" className="input" autoComplete="current-password" autoFocus />
          {state.errors?.password && <p className="field-error">Wrong password.</p>}
        </div>
        <button className="btn-red w-full" disabled={pending}>{pending ? "..." : "Log in"}</button>
      </form>
    </div>
  );
}
