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
    <main className="min-h-screen bg-ink text-ivory">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <div>
          <Link
            href="/panel"
            className="text-sm text-mist underline underline-offset-4 hover:text-ivory"
          >
            &larr; Panele d&ouml;n
          </Link>
          <h1 className="mt-3 font-display text-5xl">E&#287;itimler</h1>
        </div>

        {!aktif && (
          <p
            role="alert"
            className="rounded-2xl border border-red-400/40 bg-red-950/40 p-4 text-sm text-red-200"
          >
            Aboneli&#287;iniz aktif de&#287;il. Bu sayfa kapal&#305;. L&uuml;tfen
            destek@guzellikedu.com adresine yaz&#305;n.
          </p>
        )}

        {isAdmin && aktif && <EgitimFormu />}
        <div className="space-y-3">
          {aktif && trainings.length === 0 && (
            <p className="text-mist">
              {isAdmin
                ? "Hen\u00fcz e\u011fitim yok. Yukar\u0131daki formdan ilk e\u011fitimi ekleyin."
                : "Hen\u00fcz size a\u00e7\u0131lm\u0131\u015f bir e\u011fitim yok."}
            </p>
          )}
          {trainings.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/panel/egitimler/${t.id}`}
                  className="font-display text-2xl transition-colors hover:text-blush"
                >
                  {t.title}
                </Link>
                <span
                  className={
                    "shrink-0 rounded-full px-3 py-1 text-xs " +
                    (t.is_published
                      ? "bg-blush/15 text-blush"
                      : "border border-line text-mist")
                  }
                >
                  {t.is_published ? "Yay\u0131nda" : "Taslak"}
                </span>
              </div>
              {t.description && (
                <p className="mt-2 text-sm text-mist">{t.description}</p>
              )}
              {isAdmin && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/panel/egitimler/${t.id}/duzenle`}
                    className="rounded-full border border-line px-4 py-1.5 text-sm text-mist transition-colors hover:border-blush hover:text-ivory"
                  >
                    D&uuml;zenle
                  </Link>
                  <SilButonu id={t.id} tablo="trainings" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}