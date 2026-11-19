"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function KayitSayfasi() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError(
        "Oturum açılamadı. Supabase'de 'Confirm email' ayarının kapalı olduğundan emin olun."
      );
      setLoading(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc("register_company", {
      company_name: companyName,
      admin_name: fullName,
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
      return;
    }

    router.push("/panel");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          EduPilot AI - Firma Kaydı
        </h1>

        <input
          className="w-full rounded border border-gray-300 p-2 text-gray-900"
          placeholder="Firma adı"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-gray-300 p-2 text-gray-900"
          placeholder="Adınız Soyadınız"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-gray-300 p-2 text-gray-900"
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded border border-gray-300 p-2 text-gray-900"
          type="password"
          placeholder="Şifre (en az 8 karakter)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 p-2 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Firmayı Oluştur"}
        </button>
      </form>
    </main>
  );
}