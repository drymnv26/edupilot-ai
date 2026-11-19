import Link from "next/link";

export default function AnaSayfa() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <h1 className="text-4xl font-bold">EduPilot AI</h1>
      <p className="mt-3 text-lg text-gray-600">
        Personel eğitimlerini ve sınavlarını tek yerden yönetin. Sonuçlar
        otomatik hesaplanır, raporlar hazır gelir.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/giris"
          className="rounded bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Giriş Yap
        </Link>
        <Link
          href="/kayit"
          className="rounded border border-gray-300 px-5 py-3 font-semibold"
        >
          Firma Kaydı
        </Link>
      </div>
    </main>
  );
}