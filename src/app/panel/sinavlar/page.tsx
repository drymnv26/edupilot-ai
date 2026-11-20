import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SinavFormu from "@/components/SinavFormu";
import { abonelikAktifMi } from "@/lib/abonelik";
import SilButonu from "@/components/SilButonu";

type Sinav = {
  id: string;
  title: string;
  pass_score: number;
  is_published: boolean;
  created_at: string;
};

export default async function SinavlarSayfasi() {
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
  const aktif = await abonelikAktifMi(supabase);

  const { data } = await supabase
    .from("exams")
    .select("id, title, pass_score, is_published, created_at")
    .order("created_at", { ascending: false });

  const exams: Sinav[] = data ?? [];

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link href="/panel" className="text-sm text-blue-600 underline">
          ← Panele dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Sınavlar</h1>
      </div>

      {!aktif && (
        <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          Aboneli&#287;iniz aktif de&#287;il. Bu sayfa kapal&#305;. L&uuml;tfen platform
          y&ouml;neticisiyle ileti&#351;ime ge&ccedil;in.
        </p>
      )}

      {isAdmin && aktif && <SinavFormu />}

      <div className="space-y-3">
        {exams.length === 0 && (
          <p className="text-gray-600">Henüz sınav yok.</p>
        )}
        {exams.map((s) => (
          <div key={s.id} className="rounded-xl bg-white p-4 shadow">
            <Link
              href={`/panel/sinavlar/${s.id}`}
              className="font-semibold text-blue-600 underline"
            >
              {s.title}
            </Link>
            <p className="text-sm text-gray-600">
              Geçme puanı: {s.pass_score}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {s.is_published ? "Yayında" : "Taslak"}
            </p>
            {isAdmin && (
              <div className="flex items-start gap-3">
                <Link
                  href={`/panel/sinavlar/${s.id}/duzenle`}
                  className="mt-2 rounded border border-blue-300 px-3 py-1 text-sm text-blue-700"
                >
                  D&uuml;zenle
                </Link>
                <SilButonu id={s.id} tablo="exams" />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}