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
      className="space-y-3 rounded-xl bg-white p-6 shadow"
    >
      <h2 className="text-lg font-bold text-gray-900">Eğitimi Düzenle</h2>

      <input
        className="w-full rounded border border-gray-300 p-2 text-gray-900"
        placeholder="Eğitim başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full rounded border border-gray-300 p-2 text-gray-900"
        placeholder="Kısa açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        className="h-40 w-full rounded border border-gray-300 p-2 text-gray-900"
        placeholder="Eğitim içeriği"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
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