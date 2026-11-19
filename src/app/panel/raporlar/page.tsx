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
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link href="/panel" className="text-sm text-blue-600 underline">
          ← Panele dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {isAdmin ? "Sınav Raporları" : "Sonuçlarım"}
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white p-4 text-center shadow">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-600">Sınav girişi</p>
        </div>
        <div className="rounded-xl bg-white p-4 text-center shadow">
          <p className="text-2xl font-bold text-gray-900">{average}</p>
          <p className="text-xs text-gray-600">Ortalama puan</p>
        </div>
        <div className="rounded-xl bg-white p-4 text-center shadow">
          <p className="text-2xl font-bold text-gray-900">%{passRate}</p>
          <p className="text-xs text-gray-600">Geçme oranı</p>
        </div>
      </div>

      <div className="space-y-3">
        {total === 0 && (
          <p className="text-gray-600">Henüz sınav sonucu yok.</p>
        )}
        {attempts.map((a) => (
          <div key={a.id} className="rounded-xl bg-white p-4 shadow">
            {isAdmin && (
              <p className="font-semibold text-gray-900">
                {personNames.get(a.user_id) ?? "-"}
              </p>
            )}
            <p
              className={
                isAdmin ? "text-sm text-gray-700" : "font-semibold text-gray-900"
              }
            >
              {examTitles.get(a.exam_id) ?? "Sınav"}
            </p>
            <p className="mt-1 text-sm text-gray-800">
              Puan: <strong>{a.score}</strong> ({a.correct_count}/
              {a.total_count} doğru) ·{" "}
              <span
                className={
                  a.passed
                    ? "font-semibold text-green-700"
                    : "font-semibold text-red-600"
                }
              >
                {a.passed ? "Geçti" : "Kaldı"}
              </span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(a.created_at).toLocaleString("tr-TR", {
                timeZone: "Europe/Istanbul",
              })}
            </p>
          </div>
        ))}
        {total >= 200 && (
          <p className="text-xs text-gray-500">Son 200 sonuç gösteriliyor.</p>
        )}
      </div>
    </main>
  );
}