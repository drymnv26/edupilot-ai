"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  id: string;
  title: string;
  passScore: number;
  isPublished: boolean;
};

export default function SinavDuzenleFormu(props: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(props.title);
  const [passScore, setPassScore] = useState(String(props.passScore));
  const [published, setPublished] = useState(props.isPublished);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const score = Number(passScore);
    if (!Number.isInteger(score) || score < 0 || score > 100) {
      setError("Geçme puanı 0 ile 100 arasında bir tam sayı olmalı.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("exams")
      .update({
        title,
        pass_score: score,
        is_published: published,
      })
      .eq("id", props.id)
      .select("id");

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    if (!data || data.length === 0) {
      setError("Kaydedilemedi. Bu işlem için yetkin olmayabilir.");
      setLoading(false);
      return;
    }

    router.push("/panel/sinavlar");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-3xl">Sınavı Düzenle</h2>

      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none"
        placeholder="Sınav başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div>
        <label className="block text-sm text-mist">Geçme puanı (0-100)</label>
        <input
          type="number"
          min={0}
          max={100}
          className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none"
          value={passScore}
          onChange={(e) => setPassScore(e.target.value)}
          required
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-ivory">
        <input
          type="checkbox" className="h-4 w-4 accent-blush"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Yayında (personel görebilsin)
      </label>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}