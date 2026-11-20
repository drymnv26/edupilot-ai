"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function GirisSayfasi() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-posta veya \u015fifre hatal\u0131.");
      setLoading(false);
      return;
    }

    router.push("/panel");
    router.refresh();
  }
  const alan =
    "mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none";

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink p-4 text-ivory">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-2xl">
          G&uuml;zellik Akademisi
        </Link>
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
        >
          <h1 className="font-display text-4xl">Giri&#351; yap</h1>

          <label className="block text-sm text-mist">
            E-posta
            <input
              className={alan}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block text-sm text-mist">
            &#350;ifre
            <input
              className={alan}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
          >
            {loading ? "Giri\u015f yap\u0131l\u0131yor..." : "Giri\u015f yap"}
          </button>

          <p className="text-center text-sm text-mist">
            Hesab&#305;n&#305;z yok mu?{" "}
            <Link href="/kayit" className="text-blush underline underline-offset-4">
              Firma kayd&#305; olu&#351;turun
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}