"use client";

import { useState } from "react";
import { personelSifreYenile } from "@/app/panel/personel/actions";

export default function SifreYenile({ userId }: { userId: string }) {
  const [acik, setAcik] = useState(false);
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [tamam, setTamam] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setTamam(false);
    setYukleniyor(true);
    const sonuc = await personelSifreYenile({ userId, password: sifre });
    setYukleniyor(false);
    if (!sonuc.ok) {
      setHata(sonuc.error ?? "Bir hata olu\u015ftu.");
      return;
    }
    setSifre("");
    setAcik(false);
    setTamam(true);
  }

  if (!acik) {
    return (
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setAcik(true);
            setTamam(false);
          }}
          className="rounded-full border border-line px-4 py-1.5 text-sm text-mist transition-colors hover:border-blush hover:text-ivory"
        >
          &#350;ifreyi yenile
        </button>
        {tamam && (
          <span role="status" className="text-sm text-emerald-300">
            &#350;ifre g&uuml;ncellendi.
          </span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={kaydet} className="mt-3 space-y-3">
      <input
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        value={sifre}
        onChange={(e) => setSifre(e.target.value)}
        placeholder="Yeni &#351;ifre (en az 8 karakter)"
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
      />
      {hata && (
        <p role="alert" className="text-sm text-red-300">
          {hata}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={yukleniyor}
          className="rounded-full bg-blush px-5 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
        >
          {yukleniyor ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAcik(false);
            setSifre("");
            setHata("");
          }}
          className="rounded-full border border-line px-5 py-1.5 text-sm text-mist transition-colors hover:text-ivory"
        >
          Vazge&ccedil;
        </button>
      </div>
    </form>
  );
}