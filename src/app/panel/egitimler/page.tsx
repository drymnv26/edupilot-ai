import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EgitimFormu from "@/components/EgitimFormu";
import { abonelikAktifMi } from "@/lib/abonelik";
import SilButonu from "@/components/SilButonu";

type Egitim = {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  created_at: string;
};

export default async function EgitimlerSayfasi() {
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
    .from("trainings")
    .select("id, title, description, is_published, created_at")
    .order("created_at", { ascending: false });

  const trainings: Egitim[] = data ?? [];

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link href="/panel" className="text-sm text-blue-600 underline">
          ← Panele dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Eğitimler</h1>
      </div>

      {!aktif && (
        <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          Aboneli&#287;iniz aktif de&#287;il. Bu sayfa kapal&#305;. L&uuml;tfen platform
          y&ouml;neticisiyle ileti&#351;ime ge&ccedil;in.
        </p>
      )}

      {isAdmin && aktif && <EgitimFormu />}

      <div className="space-y-3">
        {trainings.length === 0 && (
          <p className="text-gray-600">Henüz eğitim yok.</p>
        )}
        {trainings.map((t) => (
          <div key={t.id} className="rounded-xl bg-white p-4 shadow">
            <Link href={`/panel/egitimler/${t.id}`} className="font-semibold text-blue-600 underline">{t.title}</Link>
            {t.description && (
              <p className="text-sm text-gray-600">{t.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {t.is_published ? "Yayında" : "Taslak"}
            </p>
                        {isAdmin && (
              <div className="flex items-start gap-3">
                <Link
                  href={`/panel/egitimler/${t.id}/duzenle`}
                  className="mt-2 rounded border border-blue-300 px-3 py-1 text-sm text-blue-700"
                >
                  Düzenle
                </Link>
                <SilButonu id={t.id} tablo="trainings" />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}