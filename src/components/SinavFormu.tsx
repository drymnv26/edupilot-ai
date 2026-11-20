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
      className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-3xl">Yeni Sınav Ekle</h2>

      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
        placeholder="Sınav başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <label className="block text-sm text-mist">
        Geçme puanı (0-100)
        <input
          className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none"
          type="number"
          min={0}
          max={100}
          value={passScore}
          onChange={(e) => setPassScore(e.target.value)}
          required
        />
      </label>
      <label className="flex items-center gap-3 text-sm text-ivory">
        <input
          type="checkbox" className="h-4 w-4 accent-blush"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Yayında (personel görebilsin)
      </label>
      <p className="text-xs text-mist">
        Soruları ekleyene kadar yayına almamanı öneririm.
      </p>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
      >
        {loading ? "Ekleniyor..." : "Sınavı Ekle"}
      </button>
    </form>
  );
}