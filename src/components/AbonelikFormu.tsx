"use client";

import { useState } from "react";
import { abonelikGuncelle } from "@/app/yonetim/actions";

const DURUMLAR = [
  { value: "trial", label: "Deneme (trial)" },
  { value: "active", label: "Aktif" },
  { value: "expired", label: "Süresi doldu" },
  { value: "suspended", label: "Askıya alındı" },
];

function bugundenSonra(gun: number) {
  const d = new Date(Date.now() + gun * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" });
}

export default function AbonelikFormu({
  companyId,
  status,
  endsAt,
}: {
  companyId: string;
  status: string;
  endsAt: string;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentEndsAt, setCurrentEndsAt] = useState(endsAt);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function kaydet() {
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await abonelikGuncelle({
      companyId,
      status: currentStatus,
      endsAt: currentEndsAt,
    });

    if (!result.ok) {
      setError(result.error ?? "Bir hata oluştu.");
    } else {
      setSuccess("Kaydedildi.");
    }
    setLoading(false);
  }

  function otuzGunAktif() {
    setCurrentStatus("active");
    setCurrentEndsAt(bugundenSonra(30));
  }

  return (
    <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
      <label className="block text-sm text-gray-700">
        Durum
        <select
          className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value)}
        >
          {DURUMLAR.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm text-gray-700">
        Bitiş tarihi (boş bırakırsan süre sınırı olmaz)
        <input
          type="date"
          className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
          value={currentEndsAt}
          onChange={(e) => setCurrentEndsAt(e.target.value)}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={otuzGunAktif}
          className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-800"
        >
          Bugünden +30 gün aktif yap
        </button>
        <button
          type="button"
          onClick={kaydet}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}