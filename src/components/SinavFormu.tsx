"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SinavFormu() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [passScore, setPassScore] = useState("60");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("exams").insert({
      title,
      pass_score: Number(passScore),
      is_published: published,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setPassScore("60");
    setPublished(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl bg-white p-6 shadow"
    >
      <h2 className="text-lg font-bold text-gray-900">Yeni Sınav Ekle</h2>

      <input
        className="w-full rounded border border-gray-300 p-2 text-gray-900"
        placeholder="Sınav başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label className="block text-sm text-gray-700">
        Geçme puanı (0-100)
        <input
          className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
          type="number"
          min={0}
          max={100}
          value={passScore}
          onChange={(e) => setPassScore(e.target.value)}
          required
        />
      </label>
      <label className="flex items-center gap-2 text-gray-900">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Yayında (personel görebilsin)
      </label>
      <p className="text-xs text-gray-500">
        Soruları ekleyene kadar yayına almamanı öneririm.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Ekleniyor..." : "Sınavı Ekle"}
      </button>
    </form>
  );
}