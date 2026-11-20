"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const HARFLER = ["A", "B", "C", "D", "E", "F"];

export default function SoruDuzenle({
  id,
  text,
  options,
  correctIndex,
}: {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}) {
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const [metin, setMetin] = useState(text);
  const [sikler, setSikler] = useState(options);
  const [dogru, setDogru] = useState(String(correctIndex));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setSik(index: number, value: string) {
    setSikler((prev) => prev.map((o, i) => (i === index ? value : o)));
  }
  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const temiz = sikler.map((o) => o.trim());
    if (metin.trim().length === 0 || temiz.some((o) => o.length === 0)) {
      setError("Soru ve t\u00fcm \u015f\u0131klar doldurulmal\u0131.");
      return;
    }
    setLoading(true);
    const supabase = createClient();

    const { data: q, error: qErr } = await supabase
      .from("questions")
      .update({ question_text: metin.trim(), options: temiz })
      .eq("id", id)
      .select("id");
    if (qErr || !q || q.length === 0) {
      setError(qErr?.message ?? "Soru g\u00fcncellenemedi.");
      setLoading(false);
      return;
    }

    const { data: k, error: kErr } = await supabase
      .from("question_keys")
      .update({ correct_index: Number(dogru) })
      .eq("question_id", id)
      .select("question_id");
    if (kErr) {
      setError(kErr.message);
      setLoading(false);
      return;
    }
    if (!k || k.length === 0) {
      const { error: insErr } = await supabase
        .from("question_keys")
        .insert({ question_id: id, correct_index: Number(dogru) });
      if (insErr) {
        setError(insErr.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setAcik(false);
    router.refresh();
  }
  if (!acik) {
    return (
      <button
        type="button"
        onClick={() => setAcik(true)}
        className="rounded-full border border-line px-4 py-1.5 text-sm text-mist transition-colors hover:border-blush hover:text-ivory"
      >
        D&uuml;zenle
      </button>
    );
  }

  return (
    <form onSubmit={kaydet} className="w-full space-y-3 rounded-2xl border border-line bg-ink p-4">
      <textarea
        className="h-20 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ivory focus:border-blush focus:outline-none"
        value={metin}
        onChange={(e) => setMetin(e.target.value)}
        required
      />
      {sikler.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-5 text-sm font-semibold text-mist">{HARFLER[i]}</span>
          <input
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ivory focus:border-blush focus:outline-none"
            value={s}
            onChange={(e) => setSik(i, e.target.value)}
            required
          />
        </div>
      ))}
      <label className="block text-sm text-mist">
        Do&#287;ru cevap
        <select
          className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ivory focus:border-blush focus:outline-none"
          value={dogru}
          onChange={(e) => setDogru(e.target.value)}
        >
          {sikler.map((_, i) => (
            <option key={i} value={i}>
              {HARFLER[i]}
            </option>
          ))}
        </select>
      </label>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-blush px-5 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={() => setAcik(false)}
          className="rounded-full border border-line px-5 py-1.5 text-sm text-mist transition-colors hover:text-ivory"
        >
          Vazge&ccedil;
        </button>
      </div>
    </form>
  );
}