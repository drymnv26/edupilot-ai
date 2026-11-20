"use client";

import { useState } from "react";
import { kodUret, kodAktifDegistir, kodSil } from "@/app/yonetim/kod-actions";

type Kod = {
  id: string;
  code: string;
  note: string | null;
  is_active: boolean;
  used_at: string | null;
};

type Sonuc = { ok: boolean; mesaj?: string };

export default function KodYonetimi({ kodlar }: { kodlar: Kod[] }) {
  const [note, setNote] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  async function calistir(is: () => Promise<Sonuc>) {
    setHata("");
    setYukleniyor(true);
    const sonuc = await is();
    if (!sonuc.ok) setHata(sonuc.mesaj ?? "Hata olustu");
    else setNote("");
    setYukleniyor(false);
  }

  return (
    <div className="space-y-3 rounded-xl bg-white p-4 shadow">
      <h2 className="font-semibold text-gray-900">Davet Kodlar&#305;</h2>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-gray-300 p-2 text-sm text-gray-900"
          placeholder="Not (orn. musteri adi)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          disabled={yukleniyor}
          onClick={() => calistir(() => kodUret(note))}
          className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Yeni kod &uuml;ret
        </button>
      </div>

      {hata && <p className="text-sm text-red-600">{hata}</p>}

      {kodlar.length === 0 && (
        <p className="text-sm text-gray-500">Hen&uuml;z kod yok.</p>
      )}

      {kodlar.map((k) => (
        <div
          key={k.id}
          className="flex items-center justify-between gap-2 rounded border border-gray-200 p-2"
        >
          <div>
            <p className="font-mono text-sm font-semibold text-gray-900">{k.code}</p>
            <p className="text-xs text-gray-500">
              {k.note ?? ""}{" "}
              {k.used_at
                ? "- Kullan\u0131ld\u0131"
                : k.is_active
                ? "- Aktif"
                : "- Kapal\u0131"}
            </p>
          </div>
          <div className="flex gap-2">
            {!k.used_at && (
              <button
                disabled={yukleniyor}
                onClick={() => calistir(() => kodAktifDegistir(k.id, !k.is_active))}
                className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700"
              >
                {k.is_active ? "Kapat" : "A\u00e7"}
              </button>
            )}
            <button
              disabled={yukleniyor}
              onClick={() => {
                if (window.confirm("Bu kod silinsin mi?")) calistir(() => kodSil(k.id));
              }}
              className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}