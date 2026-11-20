import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CikisButonu from "@/components/CikisButonu";
import { abonelikAktifMi } from "@/lib/abonelik";

export default async function PanelSayfasi() {
  const supabase = await createClient();
  const aktif = await abonelikAktifMi(supabase);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const { data: company } = await supabase
    .from("companies")
    .select("name, subscription_status, subscription_ends_at")
    .maybeSingle();

  const yonetici = profile?.role === "company_admin";
  const kutu =
    "block rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-blush";

  return (
    <main className="min-h-screen bg-ink text-ivory">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="flex items-center justify-between gap-4">
          <span className="font-display text-2xl">G&uuml;zellik Akademisi</span>
          <CikisButonu />
        </header>

        {!aktif && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-400/40 bg-red-950/40 p-4 text-sm text-red-200"
          >
            Aboneli&#287;iniz aktif de&#287;il. E&#287;itimler ve s&#305;navlar
            a&ccedil;&#305;lm&#305;yor. L&uuml;tfen destek@guzellikedu.com
            adresine yaz&#305;n.
          </div>
        )}

        <section className="mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-8">
          <p className="text-sm text-mist">Firma</p>
          <h1 className="font-display text-4xl">{company?.name ?? "-"}</h1>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-mist">Kullan&#305;c&#305;</dt>
              <dd className="mt-1">{profile?.full_name ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-mist">Rol</dt>
              <dd className="mt-1">{yonetici ? "Y\u00f6netici" : "Personel"}</dd>
            </div>
            <div>
              <dt className="text-mist">Abonelik</dt>
              <dd className="mt-1">{aktif ? "Aktif" : "Pasif"}</dd>
            </div>
            <div>
              <dt className="text-mist">Biti&#351;</dt>
              <dd className="mt-1">
                {company?.subscription_ends_at
                  ? new Date(company.subscription_ends_at).toLocaleDateString("tr-TR")
                  : "-"}
              </dd>
            </div>
          </dl>
        </section>
        <nav className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link href="/panel/egitimler" className={kutu}>
            <span className="font-display text-3xl">E&#287;itimler</span>
            <span className="mt-2 block text-sm text-mist">
              E&#287;itim i&ccedil;eriklerini okuyun
              {yonetici ? " ve yeni e\u011fitim ekleyin." : "."}
            </span>
          </Link>
          <Link href="/panel/sinavlar" className={kutu}>
            <span className="font-display text-3xl">S&#305;navlar</span>
            <span className="mt-2 block text-sm text-mist">
              {yonetici
                ? "S\u0131nav ve sorular\u0131 haz\u0131rlay\u0131n."
                : "S\u0131navlar\u0131n\u0131z\u0131 \u00e7\u00f6z\u00fcn."}
            </span>
          </Link>
          {yonetici && (
            <Link href="/panel/personel" className={kutu}>
              <span className="font-display text-3xl">Personel</span>
              <span className="mt-2 block text-sm text-mist">
                &Ccedil;al&#305;&#351;anlar&#305;n&#305;z&#305; ekleyin ve y&ouml;netin.
              </span>
            </Link>
          )}
          <Link href="/panel/raporlar" className={kutu}>
            <span className="font-display text-3xl">
              {yonetici ? "Raporlar" : "Sonu\u00e7lar\u0131m"}
            </span>
            <span className="mt-2 block text-sm text-mist">
              {yonetici
                ? "Personelin s\u0131nav sonu\u00e7lar\u0131n\u0131 g\u00f6r\u00fcn."
                : "Ald\u0131\u011f\u0131n\u0131z puanlar\u0131 g\u00f6r\u00fcn."}
            </span>
          </Link>
        {yonetici && (<Link href="/panel/gorunum" className={kutu}><span className="font-display text-3xl">G&ouml;r&uuml;n&uuml;m</span><span className="mt-2 block text-sm text-mist">Firman&#305;z&#305;n renk temas&#305;n&#305; se&ccedil;in.</span></Link>)}</nav>
      </div>
    </main>
  );
}