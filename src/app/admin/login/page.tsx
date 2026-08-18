"use client";

import { useFormState } from "react-dom";
import { loginAction } from "@/app/actions/auth";
import { Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Hack for React 18 / 19 types compatibility with useFormState
const actionWrapper = async (prevState: any, formData: FormData) => {
  return await loginAction(formData);
};

export default function LoginPage() {
  const [state, formAction] = useFormState(actionWrapper, null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (state) setIsPending(false);
  }, [state]);

  const handleSubmit = () => setIsPending(true);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex h-16 items-center border-b border-paper-line bg-white px-6">
        <Link href="/" className="flex items-center gap-2 text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <Layers className="h-4 w-4" />
          </span>
          <span className="font-bold tracking-tight">Choose Property</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-paper-line bg-white p-8 shadow-card">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-ink">Admin Login</h1>
            <p className="mt-2 text-sm text-ink-soft">
              Sign in to manage properties and leads.
            </p>
          </div>

          <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-ink"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@chooseproperty.in"
                className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2.5 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-ink"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2.5 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>

            {state?.error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 font-semibold text-white transition-opacity disabled:opacity-50 hover:opacity-90"
            >
              {isPending ? "Signing in..." : "Sign in"}
              {!isPending && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
