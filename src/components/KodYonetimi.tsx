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
    <div className="space-y-4 rounded-3xl border border-line bg-surface p-6">
      <h2 className="font-display text-3xl">Davet Kodlar&#305;</h2>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-line bg-ink px-4 py-2 text-sm text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
          placeholder="Not (orn. musteri adi)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          disabled={yukleniyor}
          onClick={() => calistir(() => kodUret(note))}
          className="rounded-full bg-blush px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
        >
          Yeni kod &uuml;ret
        </button>
      </div>

      {hata && <p role="alert" className="text-sm text-red-300">{hata}</p>}

      {kodlar.length === 0 && (
        <p className="text-sm text-mist">Hen&uuml;z kod yok.</p>
      )}

      {kodlar.map((k) => (
        <div
          key={k.id}
          className="flex items-center justify-between gap-2 rounded-xl border border-line bg-ink p-3"
        >
          <div>
            <p className="font-mono text-base font-semibold text-blush">{k.code}</p>
            <p className="mt-1 text-xs text-mist">
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
                className="rounded-full border border-line px-3 py-1 text-xs text-mist transition-colors hover:border-blush hover:text-ivory"
              >
                {k.is_active ? "Kapat" : "A\u00e7"}
              </button>
            )}
            <button
              disabled={yukleniyor}
              onClick={() => {
                if (window.confirm("Bu kod silinsin mi?")) calistir(() => kodSil(k.id));
              }}
              className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-300 transition-colors hover:bg-red-950/40"
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}