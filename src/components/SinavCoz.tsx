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
      <div className="space-y-3 rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-bold text-gray-900">Sınav Sonucu</h2>
        <p className="text-4xl font-bold text-gray-900">{result.score}</p>
        <p
          className={
            result.passed
              ? "font-semibold text-green-700"
              : "font-semibold text-red-600"
          }
        >
          {result.passed ? "Geçtiniz" : "Kaldınız"} (geçme puanı: {passScore})
        </p>
        <p className="text-sm text-gray-600">
          {result.total_count} sorudan {result.correct_count} tanesini doğru
          yanıtladınız.
        </p>
        <button
          onClick={tekrarDene}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          Tekrar Çöz
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {questions.map((q, index) => (
        <div key={q.id} className="rounded-xl bg-white p-4 shadow">
          <p className="font-semibold text-gray-900">
            {index + 1}. {q.question_text}
          </p>
          <div className="mt-2 space-y-1">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center gap-2 text-sm text-gray-800"
              >
                <input
                  type="radio"
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Gönderiliyor..." : "Sınavı Bitir"}
      </button>
    </form>
  );
}