import Link from "next/link";

export default function AnaSayfa() {
  return (
    <div className="min-h-screen bg-ink text-ivory">
      <div className="mx-auto max-w-6xl px-6">
        <header className="flex items-center justify-between py-6">
          <span className="font-display text-2xl">G&uuml;zellik Akademisi</span>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/giris" className="text-mist transition-colors hover:text-ivory">
              Giri&#351; yap
            </Link>
            <Link
              href="/kayit"
              className="rounded-full border border-line px-4 py-2 transition-colors hover:border-blush hover:text-blush"
            >
              Firma kayd&#305;
            </Link>
          </nav>
        </header>

        <main>
          <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
            <div>
              <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">
                Ekibiniz her m&uuml;&#351;teriye ayn&#305; kaliteyi sunsun.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-mist">
                Salon personeliniz i&ccedil;in e&#287;itimleri ve s&#305;navlar&#305; tek yerden
                y&ouml;netin. Puanlar kendili&#287;inden hesaplan&#305;r, kimin neyi
                &ouml;&#287;rendi&#287;i tek bak&#305;&#351;ta g&ouml;r&uuml;n&uuml;r.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/kayit"
                  className="rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep"
                >
                  Firma kayd&#305; olu&#351;tur
                </Link>
                <Link href="/giris" className="px-2 py-3 text-mist transition-colors hover:text-ivory">
                  Giri&#351; yap
                </Link>
              </div>
              <p className="mt-5 max-w-md text-sm text-mist">
                Kay&#305;t i&ccedil;in davet kodu gerekir. Kodu almak i&ccedil;in
                destek@guzellikedu.com adresine yaz&#305;n.
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <p className="text-sm text-mist">&Ouml;rnek soru</p>
              <p className="mt-3 font-display text-2xl leading-snug">
                Sa&ccedil; boyas&#305;n&#305; uygulamadan &ouml;nce hangi test yap&#305;lmal&#305;?
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center justify-between rounded-xl border border-blush bg-raised px-4 py-3">
                  <span>A) Alerji (yama) testi</span>
                  <span className="text-blush">&#10003;</span>
                </li>
                <li className="rounded-xl border border-line px-4 py-3 text-mist">
                  B) Sadece sa&ccedil; analizi
                </li>
                <li className="rounded-xl border border-line px-4 py-3 text-mist">
                  C) Test gerekmez
                </li>
                <li className="rounded-xl border border-line px-4 py-3 text-mist">
                  D) Cilt nemi &ouml;l&ccedil;&uuml;m&uuml;
                </li>
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm text-mist">
                <span>Boya g&uuml;venli&#287;i s&#305;nav&#305;</span>
                <span>
                  90 puan <span className="ml-1 text-blush">Ge&ccedil;ti</span>
                </span>
              </div>
            </div>
          </section>

          <section className="grid gap-8 border-t border-line py-14 md:grid-cols-3">
            <div>
              <p className="font-display text-3xl text-blush">1</p>
              <h2 className="mt-3 text-lg font-semibold">E&#287;itimi yay&#305;nlay&#305;n</h2>
              <p className="mt-2 text-mist">
                Salon kurallar&#305;n&#305;, &uuml;r&uuml;n bilgisini ya da hijyen ad&#305;mlar&#305;n&#305;
                yaz&#305;n. Personel kendi hesab&#305;ndan okusun.
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-blush">2</p>
              <h2 className="mt-3 text-lg font-semibold">S&#305;nav&#305; &ccedil;&ouml;zd&uuml;r&uuml;n</h2>
              <p className="mt-2 text-mist">
                &Ccedil;oktan se&ccedil;meli sorular haz&#305;rlay&#305;n, ge&ccedil;me puan&#305;n&#305; siz belirleyin.
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-blush">3</p>
              <h2 className="mt-3 text-lg font-semibold">Sonucu g&ouml;r&uuml;n</h2>
              <p className="mt-2 text-mist">
                Puan otomatik hesaplan&#305;r. Kimin ge&ccedil;ti&#287;i, kimin tekrar etmesi
                gerekti&#287;i raporda durur.
              </p>
            </div>
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-8 text-sm text-mist">
          <Link href="/gizlilik" className="transition-colors hover:text-ivory">
            Gizlilik ve Ki&#351;isel Veriler
          </Link>
          <a href="mailto:destek@guzellikedu.com" className="transition-colors hover:text-ivory">
            destek@guzellikedu.com
          </a>
        </footer>
      </div>
    </div>
  );
}