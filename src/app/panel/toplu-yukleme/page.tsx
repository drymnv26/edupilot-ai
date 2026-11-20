import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CsvYukle from "@/components/CsvYukle";

const kart = "rounded-2xl border border-line bg-surface p-6";
const kod = "rounded-lg bg-ink px-2 py-1 text-sm text-ivory";

export default async function TopluYuklemeSayfasi() {
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

  if (profile?.role !== "company_admin") {
    redirect("/panel");
  }

  return (
    <main className="min-h-screen bg-ink text-ivory">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <div>
          <Link
            href="/panel"
            className="block text-sm text-mist underline underline-offset-4 hover:text-ivory"
          >
            &larr; Panele d&ouml;n
          </Link>
          <h1 className="mt-2 font-display text-5xl">Toplu y&uuml;kleme</h1>
          <p className="mt-2 text-sm text-mist">
            Excel ile haz&#305;rlad&#305;&#287;&#305;n&#305;z listeyi CSV olarak kaydedip tek
            seferde y&uuml;kleyin. Excel&apos;de Farkl&#305; Kaydet ile CSV UTF-8
            se&ccedil;in. Hatal&#305; bir sat&#305;r varsa hi&ccedil;bir kay&#305;t eklenmez ve
            sorunun hangi sat&#305;rda oldu&#287;u g&ouml;sterilir.
          </p>
        </div>
        <section className={kart}>
          <h2 className="font-display text-3xl">E&#287;itimler</h2>
          <p className="mt-2 text-sm text-mist">
            S&uuml;tunlar:{" "}
            <span className={kod}>Ba&#351;l&#305;k</span>{" "}
            <span className={kod}>A&ccedil;&#305;klama</span>{" "}
            <span className={kod}>&#304;&ccedil;erik</span>. Ba&#351;l&#305;k
            zorunlu, di&#287;erleri bo&#351; b&#305;rak&#305;labilir. Y&uuml;klenen
            e&#287;itimler yay&#305;nda olur.
          </p>
          <a
            href="/ornek-egitimler.csv"
            download
            className="mt-3 inline-block text-sm text-blush underline underline-offset-4"
          >
            &Ouml;rnek dosyay&#305; indir
          </a>
          <div className="mt-4">
            <CsvYukle tur="egitim" />
          </div>
        </section>

        <section className={kart}>
          <h2 className="font-display text-3xl">S&#305;nav sorular&#305;</h2>
          <p className="mt-2 text-sm text-mist">
            S&uuml;tunlar: <span className={kod}>S&#305;nav</span>{" "}
            <span className={kod}>Soru</span> <span className={kod}>A</span>{" "}
            <span className={kod}>B</span> <span className={kod}>C</span>{" "}
            <span className={kod}>D</span>{" "}
            <span className={kod}>Do&#287;ru cevap</span> (A, B, C veya D). S&#305;nav
            ad&#305; zaten varsa sorular o s&#305;nava eklenir, yoksa taslak olarak
            yeni bir s&#305;nav a&ccedil;&#305;l&#305;r. Yay&#305;na almay&#305;
            S&#305;navlar sayfas&#305;ndan siz yapars&#305;n&#305;z.
          </p>
          <a
            href="/ornek-sorular.csv"
            download
            className="mt-3 inline-block text-sm text-blush underline underline-offset-4"
          >
            &Ouml;rnek dosyay&#305; indir
          </a>
          <div className="mt-4">
            <CsvYukle tur="soru" />
          </div>
        </section>
      </div>
    </main>
  );
}