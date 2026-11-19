import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SoruFormu from "@/components/SoruFormu";
import SinavCoz from "@/components/SinavCoz";

type Soru = {
  id: string;
  question_text: string;
  options: string[];
  position: number;
};

export default async function SinavDetaySayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "company_admin";

  const { data: exam } = await supabase
    .from("exams")
    .select("id, title, pass_score, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!exam) {
    notFound();
  }

  const { data: questionData } = await supabase
    .from("questions")
    .select("id, question_text, options, position")
    .eq("exam_id", id)
    .order("position", { ascending: true });

  const questions = (questionData ?? []) as Soru[];

  // Doğru cevaplar sadece yöneticiye gelir (RLS personeli engeller)
  const answerMap = new Map<string, number>();
  if (isAdmin && questions.length > 0) {
    const { data: keys } = await supabase
      .from("question_keys")
      .select("question_id, correct_index")
      .in(
        "question_id",
        questions.map((q) => q.id)
      );
    (keys ?? []).forEach((k) => answerMap.set(k.question_id, k.correct_index));
  }

  const harfler = ["A", "B", "C", "D", "E", "F"];

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link href="/panel/sinavlar" className="text-sm text-blue-600 underline">
          ← Sınavlara dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{exam.title}</h1>
        <p className="text-sm text-gray-600">
          Geçme puanı: {exam.pass_score} ·{" "}
          {exam.is_published ? "Yayında" : "Taslak"} · {questions.length} soru
        </p>
      </div>

      {isAdmin ? (
        <>
          <SoruFormu examId={exam.id} nextPosition={questions.length + 1} />

          <div className="space-y-3">
            {questions.length === 0 && (
              <p className="text-gray-600">Bu sınavda henüz soru yok.</p>
            )}
            {questions.map((q, index) => (
              <div key={q.id} className="rounded-xl bg-white p-4 shadow">
                <p className="font-semibold text-gray-900">
                  {index + 1}. {q.question_text}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-800">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      {harfler[i]}) {opt}
                      {answerMap.get(q.id) === i && (
                        <span className="ml-2 font-semibold text-green-700">
                          ✓ doğru
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : questions.length === 0 ? (
        <p className="text-gray-600">Bu sınavda henüz soru yok.</p>
      ) : (
        <SinavCoz
          examId={exam.id}
          passScore={exam.pass_score}
          questions={questions}
        />
      )}
    </main>
  );
}