"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Soru = {
  id: string;
  question_text: string;
  options: string[];
};

type Sonuc = {
  score: number;
  passed: boolean;
  correct_count: number;
  total_count: number;
};

const HARFLER = ["A", "B", "C", "D", "E", "F"];

export default function SinavCoz({
  examId,
  passScore,
  questions,
}: {
  examId: string;
  passScore: number;
  questions: Soru[];
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Sonuc | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (Object.keys(answers).length < questions.length) {
      setError("Lütfen tüm soruları cevaplayın.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("submit_exam", {
      p_exam_id: examId,
      p_answers: answers,
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
      return;
    }

    setResult(data as Sonuc);
    setLoading(false);
  }

  function tekrarDene() {
    setAnswers({});
    setResult(null);
    setError("");
  }

  if (result) {
    return (
      <div className="space-y-4 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="font-display text-3xl">Sınav Sonucu</h2>
        <p className="font-display text-7xl text-blush">{result.score}</p>
        <p
          className={
            result.passed
              ? "font-semibold text-emerald-300"
              : "font-semibold text-red-300"
          }
        >
          {result.passed ? "Geçtiniz" : "Kaldınız"} (geçme puanı: {passScore})
        </p>
        <p className="text-sm text-mist">
          {result.total_count} sorudan {result.correct_count} tanesini doğru
          yanıtladınız.
        </p>
        <button
          onClick={tekrarDene}
          className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep"
        >
          Tekrar Çöz
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {questions.map((q, index) => (
        <div key={q.id} className="rounded-2xl border border-line bg-surface p-5">
          <p className="font-display text-2xl">
            {index + 1}. {q.question_text}
          </p>
          <div className="mt-4 space-y-3">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className="flex cursor-pointer items-center gap-3 text-base text-ivory"
              >
                <input
                  type="radio" className="h-4 w-4 accent-blush"
                  name={q.id}
                  checked={answers[q.id] === i}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: i }))
                  }
                />
                {HARFLER[i]}) {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep disabled:opacity-50"
      >
        {loading ? "Gönderiliyor..." : "Sınavı Bitir"}
      </button>
    </form>
  );
}