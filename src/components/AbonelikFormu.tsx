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
    <div className="mt-4 space-y-3 border-t border-line pt-4">
      <label className="block text-sm text-mist">
        Durum
        <select
          className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory scheme-dark focus:border-blush focus:outline-none"
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

      <label className="block text-sm text-mist">
        Bitiş tarihi (boş bırakırsan süre sınırı olmaz)
        <input
          type="date"
          className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory scheme-dark focus:border-blush focus:outline-none"
          value={currentEndsAt}
          onChange={(e) => setCurrentEndsAt(e.target.value)}
        />
      </label>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {success && <p className="text-sm text-emerald-300">{success}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={otuzGunAktif}
          className="rounded-full border border-line px-4 py-2 text-sm text-mist transition-colors hover:border-blush hover:text-ivory"
        >
          Bugünden +30 gün aktif yap
        </button>
        <button
          type="button"
          onClick={kaydet}
          disabled={loading}
          className="rounded-full bg-blush px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}