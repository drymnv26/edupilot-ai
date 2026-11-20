"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  isPublished: boolean;
};

export default function EgitimDuzenleFormu(props: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description ?? "");
  const [content, setContent] = useState(props.content ?? "");
  const [published, setPublished] = useState(props.isPublished);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("trainings")
      .update({
        title,
        description,
        content,
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

    router.push("/panel/egitimler");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-3xl">Eğitimi Düzenle</h2>

      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
        placeholder="Eğitim başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
        placeholder="Kısa açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        className="h-40 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory placeholder:text-mist focus:border-blush focus:outline-none"
        placeholder="Eğitim içeriği"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
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