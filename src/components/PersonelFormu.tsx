"use client";

import { useState } from "react";
import { personelEkle } from "@/app/panel/personel/actions";

export default function PersonelFormu() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await personelEkle({ fullName, email, password });

    if (!result.ok) {
      setError(result.error ?? "Bir hata oluştu.");
      setLoading(false);
      return;
    }

    setSuccess("Personel eklendi. E-posta ve şifreyi personele iletin.");
    setFullName("");
    setEmail("");
    setPassword("");
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-3xl">Yeni Personel Ekle</h2>

      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
        placeholder="Ad Soyad"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
        type="text"
        placeholder="Geçici şifre (en az 8 karakter)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {success && <p className="text-sm text-emerald-300">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
      >
        {loading ? "Ekleniyor..." : "Personeli Ekle"}
      </button>
    </form>
  );
}