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
    <main className="min-h-screen bg-ink text-ivory"><div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/panel" className="block text-sm text-mist underline underline-offset-4 hover:text-ivory">
          ← Panele dön
        </Link>
        <h1 className="mt-3 font-display text-5xl">Sınavlar</h1>
      </div>

      {!aktif && (
        <p className="rounded-2xl border border-red-400/40 bg-red-950/40 p-4 text-sm text-red-200">
          Aboneli&#287;iniz aktif de&#287;il. Bu sayfa kapal&#305;. L&uuml;tfen platform
          y&ouml;neticisiyle ileti&#351;ime ge&ccedil;in.
        </p>
      )}

      {isAdmin && aktif && <SinavFormu />}

      <div className="space-y-3">
        {aktif && exams.length === 0 && (
          <p className="text-mist">Henüz sınav yok.</p>
        )}
        {exams.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-surface p-5">
            <Link
              href={`/panel/sinavlar/${s.id}`}
              className="font-display text-2xl transition-colors hover:text-blush"
            >
              {s.title}
            </Link>
            <p className="mt-2 text-sm text-mist">
              Geçme puanı: {s.pass_score}
            </p>
            <p className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-xs text-mist">
              {s.is_published ? "Yayında" : "Taslak"}
            </p>
            {isAdmin && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/panel/sinavlar/${s.id}/duzenle`}
                  className="rounded-full border border-line px-4 py-1.5 text-sm text-mist transition-colors hover:border-blush hover:text-ivory"
                >
                  D&uuml;zenle
                </Link>
                <SilButonu id={s.id} tablo="exams" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div></main>
  );
}