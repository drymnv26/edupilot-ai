import Link from "next/link";
import SilButonu from "@/components/SilButonu";
import SoruDuzenle from "@/components/SoruDuzenle";
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
    <main className="min-h-screen bg-ink text-ivory"><div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/panel/sinavlar" className="block text-sm text-mist underline underline-offset-4 hover:text-ivory">
          ← Sınavlara dön
        </Link>
        <h1 className="mt-3 font-display text-5xl">{exam.title}</h1>
        <p className="mt-2 text-sm text-mist">
          Geçme puanı: {exam.pass_score} ·{" "}
          {exam.is_published ? "Yayında" : "Taslak"} · {questions.length} soru
        </p>
      </div>

      {isAdmin ? (
        <>
          <SoruFormu examId={exam.id} nextPosition={Math.max(0, ...questions.map((q) => q.position)) + 1} />

          <div className="space-y-3">
            {questions.length === 0 && (
              <p className="text-mist">Bu sınavda henüz soru yok.</p>
            )}
            {questions.map((q, index) => (
              <div key={q.id} className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-display text-2xl">
                  {index + 1}. {q.question_text}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-mist">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      {harfler[i]}) {opt}
                      {answerMap.get(q.id) === i && (
                        <span className="ml-2 font-semibold text-emerald-300">
                          ✓ doğru
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-3"><SoruDuzenle id={q.id} text={q.question_text} options={q.options} correctIndex={answerMap.get(q.id) ?? 0} /><SilButonu id={q.id} tablo="questions" /></div>
              </div>
            ))}
          </div>
        </>
      ) : questions.length === 0 ? (
        <p className="text-mist">Bu sınavda henüz soru yok.</p>
      ) : (
        <SinavCoz
          examId={exam.id}
          passScore={exam.pass_score}
          questions={questions}
        />
      )}
    </div></main>
  );
}