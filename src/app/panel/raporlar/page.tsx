import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Deneme = {
  id: string;
  exam_id: string;
  user_id: string;
  score: number;
  passed: boolean;
  correct_count: number;
  total_count: number;
  created_at: string;
};

export default async function RaporlarSayfasi() {
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

  // Yönetici firmadaki tüm sonuçları, personel sadece kendininkileri görür (RLS)
  const { data: attemptData } = await supabase
    .from("exam_attempts")
    .select(
      "id, exam_id, user_id, score, passed, correct_count, total_count, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const attempts = (attemptData ?? []) as Deneme[];

  const examTitles = new Map<string, string>();
  const personNames = new Map<string, string>();

  if (attempts.length > 0) {
    const examIds = Array.from(new Set(attempts.map((a) => a.exam_id)));
    const userIds = Array.from(new Set(attempts.map((a) => a.user_id)));

    const { data: exams } = await supabase
      .from("exams")
      .select("id, title")
      .in("id", examIds);
    (exams ?? []).forEach((e) => examTitles.set(e.id, e.title));

    const { data: people } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);
    (people ?? []).forEach((p) => personNames.set(p.id, p.full_name ?? "-"));
  }

  const total = attempts.length;
  const passedCount = attempts.filter((a) => a.passed).length;
  const average =
    total > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / total)
      : 0;
  const passRate = total > 0 ? Math.round((passedCount * 100) / total) : 0;

  return (
    <main className="min-h-screen bg-ink text-ivory"><div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/panel" className="block text-sm text-mist underline underline-offset-4 hover:text-ivory">
          ← Panele dön
        </Link>
        <h1 className="mt-3 font-display text-5xl">
          {isAdmin ? "Sınav Raporları" : "Sonuçlarım"}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-line bg-surface p-5 text-center">
          <p className="font-display text-4xl text-blush">{total}</p>
          <p className="mt-1 text-xs text-mist">Sınav girişi</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 text-center">
          <p className="font-display text-4xl text-blush">{average}</p>
          <p className="mt-1 text-xs text-mist">Ortalama puan</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 text-center">
          <p className="font-display text-4xl text-blush">%{passRate}</p>
          <p className="mt-1 text-xs text-mist">Geçme oranı</p>
        </div>
      </div>

      <div className="space-y-3">
        {total === 0 && (
          <p className="text-mist">Henüz sınav sonucu yok.</p>
        )}
        {attempts.map((a) => (
          <div key={a.id} className="rounded-2xl border border-line bg-surface p-5">
            {isAdmin && (
              <p className="font-display text-2xl">
                {personNames.get(a.user_id) ?? "-"}
              </p>
            )}
            <p
              className={
                isAdmin ? "text-sm text-mist" : "font-display text-2xl"
              }
            >
              {examTitles.get(a.exam_id) ?? "Sınav"}
            </p>
            <p className="mt-2 text-sm text-ivory">
              Puan: <strong>{a.score}</strong> ({a.correct_count}/
              {a.total_count} doğru) ·{" "}
              <span
                className={
                  a.passed
                    ? "font-semibold text-emerald-300"
                    : "font-semibold text-red-300"
                }
              >
                {a.passed ? "Geçti" : "Kaldı"}
              </span>
            </p>
            <p className="mt-2 text-xs text-mist">
              {new Date(a.created_at).toLocaleString("tr-TR", {
                timeZone: "Europe/Istanbul",
              })}
            </p>
          </div>
        ))}
        {total >= 200 && (
          <p className="text-xs text-mist">Son 200 sonuç gösteriliyor.</p>
        )}
      </div>
    </div></main>
  );
}