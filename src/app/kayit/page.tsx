"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function KayitSayfasi() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    let oturumVar = false;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      const giris = await supabase.auth.signInWithPassword({ email, password });
      if (giris.error) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      oturumVar = true;
    } else {
      oturumVar = !!data.session;
    }

    if (!oturumVar) {
      setError(
        "Oturum a\u00e7\u0131lamad\u0131. L\u00fctfen destek@guzellikedu.com adresine yaz\u0131n."
      );
      setLoading(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc("register_company", {
      company_name: companyName,
      admin_name: fullName,
      invite_code: inviteCode,
    });

    if (rpcError) {
      setError(rpcError.message);
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
      <div className="w-full max-w-md py-8">
        <Link href="/" className="font-display text-2xl">
          G&uuml;zellik Akademisi
        </Link>
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
        >
          <h1 className="font-display text-4xl">Firma kayd&#305;</h1>

          <label className="block text-sm text-mist">
            Firma ad&#305;
            <input
              className={alan}
              autoComplete="organization"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </label>

          <label className="block text-sm text-mist">
            Ad&#305;n&#305;z soyad&#305;n&#305;z
            <input
              className={alan}
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

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
            &#350;ifre (en az 8 karakter)
            <input
              className={alan}
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="block text-sm text-mist">
            Davet kodu
            <input
              className={alan + " uppercase tracking-widest"}
              autoCapitalize="characters"
              spellCheck={false}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
            <span className="mt-2 block text-xs">
              Kodu destek@guzellikedu.com adresinden alabilirsiniz.
            </span>
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
            {loading ? "Kaydediliyor..." : "Firmay\u0131 olu\u015ftur"}
          </button>

          <p className="text-center text-xs text-mist">
            Kay&#305;t olarak{" "}
            <Link href="/gizlilik" className="underline underline-offset-2">
              Gizlilik ve Ki&#351;isel Veriler
            </Link>{" "}
            metnini okudu&#287;unuzu kabul edersiniz.
          </p>

          <p className="text-center text-sm text-mist">
            Zaten hesab&#305;n&#305;z var m&#305;?{" "}
            <Link href="/giris" className="text-blush underline underline-offset-4">
              Giri&#351; yap&#305;n
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}