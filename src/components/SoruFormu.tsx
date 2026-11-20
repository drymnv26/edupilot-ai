"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const HARFLER = ["A", "B", "C", "D"];

export default function SoruFormu({
  examId,
  nextPosition,
}: {
  examId: string;
  nextPosition: number;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState("0");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleaned = options.map((o) => o.trim());
    if (cleaned.some((o) => o.length === 0)) {
      setError("4 şıkkı da doldurun.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({
        exam_id: examId,
        question_text: text.trim(),
        options: cleaned,
        position: nextPosition,
      })
      .select("id")
      .single();

    if (questionError || !question) {
      setError(questionError?.message ?? "Soru eklenemedi.");
      setLoading(false);
      return;
    }

    const { error: keyError } = await supabase
      .from("question_keys")
      .insert({ question_id: question.id, correct_index: Number(correct) });

    if (keyError) {
      // Cevap anahtarı yazılamadıysa yarım kalan soruyu geri al
      await supabase.from("questions").delete().eq("id", question.id);
      setError(keyError.message);
      setLoading(false);
      return;
    }

    setText("");
    setOptions(["", "", "", ""]);
    setCorrect("0");
    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <h2 className="font-display text-3xl">Yeni Soru Ekle</h2>

      <textarea
        className="h-24 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none placeholder:text-mist"
        placeholder="Soru metni"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />

      {HARFLER.map((harf, i) => (
        <input
          key={harf}
          className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none placeholder:text-mist"
          placeholder={`${harf} şıkkı`}
          value={options[i]}
          onChange={(e) => setOption(i, e.target.value)}
          required
        />
      ))}

      <label className="block text-sm text-mist">
        Doğru cevap
        <select
          className="mt-2 w-full rounded-xl border border-line bg-ink px-4 py-3 text-base text-ivory focus:border-blush focus:outline-none"
          value={correct}
          onChange={(e) => setCorrect(e.target.value)}
        >
          {HARFLER.map((harf, i) => (
            <option key={harf} value={i}>
              {harf}
            </option>
          ))}
        </select>
      </label>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
      >
        {loading ? "Ekleniyor..." : "Soruyu Ekle"}
      </button>
    </form>
  );
}