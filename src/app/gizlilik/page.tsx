import Link from "next/link";

export default function GizlilikSayfasi() {
  return (
    <main className="min-h-screen bg-ink text-ivory/80"><div className="mx-auto max-w-2xl space-y-5 px-4 py-8 leading-7">
      <Link href="/" className="block text-sm text-mist underline underline-offset-4 hover:text-ivory">&larr; Ana sayfa</Link>
      <h1 className="font-display text-5xl text-ivory">
        Gizlilik ve Ki&#351;isel Veriler
      </h1>
      <p className="text-sm text-mist">Son g&uuml;ncelleme: 20 Kas&#305;m 2026</p>

      <h2 className="pt-4 font-display text-3xl text-ivory">Hangi verileri topluyoruz?</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Ad soyad ve e-posta adresi (firma y&ouml;neticisi ve personel).</li>
        <li>Firma ad&#305; ve abonelik bilgisi.</li>
        <li>E&#287;itim ve s&#305;nav verileri: s&#305;nav sonu&ccedil;lar&#305;, puanlar ve tarihleri.</li>
        <li>&#350;ifreniz g&uuml;venli bir bi&ccedil;imde (&ouml;zet olarak) saklan&#305;r, taraf&#305;m&#305;zca okunamaz.</li>
      </ul>

      <h2 className="pt-4 font-display text-3xl text-ivory">Neden kullan&#305;yoruz?</h2>
      <p>
        Verileri yaln&#305;zca hizmeti sunmak i&ccedil;in kullan&#305;r&#305;z: hesap a&ccedil;mak,
        e&#287;itim ve s&#305;nav y&ouml;netmek, sonu&ccedil;lar&#305; hesaplay&#305;p raporlamak.
        Verilerinizi sat&#305;lmaz, reklam i&ccedil;in kullanmay&#305;z.
      </p>

      <h2 className="pt-4 font-display text-3xl text-ivory">Nerede saklan&#305;yor?</h2>
      <p>
        Veriler Supabase veritaban&#305;nda, Avrupa (&#304;rlanda) b&ouml;lgesinde saklan&#305;r.
        Uygulama Vercel &uuml;zerinde &ccedil;al&#305;&#351;&#305;r.
      </p>

      <h2 className="pt-4 font-display text-3xl text-ivory">Verilere kimler eri&#351;ebilir?</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Bir firman&#305;n verilerini yaln&#305;zca o firman&#305;n y&ouml;neticisi g&ouml;r&uuml;r.</li>
        <li>Personel yaln&#305;zca kendi sonu&ccedil;lar&#305;n&#305; g&ouml;r&uuml;r.</li>
        <li>Firmalar birbirlerinin verilerini g&ouml;remez.</li>
        <li>Platform y&ouml;neticisi, teknik destek ve abonelik y&ouml;netimi i&ccedil;in gerekti&#287;inde eri&#351;ebilir.</li>
      </ul>

      <h2 className="pt-4 font-display text-3xl text-ivory">Haklar&#305;n&#305;z</h2>
      <p>
        6698 say&#305;l&#305; KVKK kapsam&#305;nda verilerinizin hangi ama&ccedil;la i&#351;lendi&#287;ini
        &ouml;&#287;renme, d&uuml;zeltilmesini veya silinmesini isteme hakk&#305;n&#305;z vard&#305;r.
        Taleplerinizi a&#351;a&#287;&#305;daki adrese iletebilirsiniz.
      </p>

      <h2 className="pt-4 font-display text-3xl text-ivory">&#304;leti&#351;im</h2>
      <p>
        <a href="mailto:destek@guzellikedu.com" className="text-blush underline underline-offset-4">
          destek@guzellikedu.com
        </a>
      </p>
    </div></main>
  );
}