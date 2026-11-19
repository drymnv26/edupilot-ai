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
      className="space-y-3 rounded-xl bg-white p-6 shadow"
    >
      <h2 className="text-lg font-bold text-gray-900">Yeni Personel Ekle</h2>

      <input
        className="w-full rounded border border-gray-300 p-2 text-gray-900"
        placeholder="Ad Soyad"
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
        type="text"
        placeholder="Geçici şifre (en az 8 karakter)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Ekleniyor..." : "Personeli Ekle"}
      </button>
    </form>
  );
}