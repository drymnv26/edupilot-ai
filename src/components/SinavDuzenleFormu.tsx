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
      className="space-y-3 rounded-xl bg-white p-6 shadow"
    >
      <h2 className="text-lg font-bold text-gray-900">Sınavı Düzenle</h2>

      <input
        className="w-full rounded border border-gray-300 p-2 text-gray-900"
        placeholder="Sınav başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div>
        <label className="text-sm text-gray-700">Geçme puanı (0-100)</label>
        <input
          type="number"
          min={0}
          max={100}
          className="w-full rounded border border-gray-300 p-2 text-gray-900"
          value={passScore}
          onChange={(e) => setPassScore(e.target.value)}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-gray-900">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Yayında (personel görebilsin)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}