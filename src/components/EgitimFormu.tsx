"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EgitimFormu() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("trainings").insert({
      title,
      description,
      content,
      is_published: published,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setDescription("");
    setContent("");
    setLoading(false);
    router.refresh();
  }
  const alan =
    "mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-3xl">Yeni e&#287;itim ekle</h2>

      <label className="block text-sm text-mist">
        E&#287;itim ba&#351;l&#305;&#287;&#305;
        <input
          className={alan}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label className="block text-sm text-mist">
        K&#305;sa a&ccedil;&#305;klama
        <input
          className={alan}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="block text-sm text-mist">
        E&#287;itim i&ccedil;eri&#287;i
        <textarea
          className={alan + " h-40"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>

      <label className="flex items-center gap-3 text-sm text-ivory">
        <input
          type="checkbox"
          className="h-4 w-4 accent-blush"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Yay&#305;nda (personel g&ouml;rebilsin)
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
      >
        {loading ? "Ekleniyor..." : "E\u011fitimi ekle"}
      </button>
    </form>
  );
}