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

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel</h1>
      {!aktif && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          Aboneli&#287;iniz aktif de&#287;il. E&#287;itimler ve s&#305;navlar a&ccedil;&#305;lm&#305;yor.
          L&uuml;tfen platform y&ouml;neticisiyle ileti&#351;ime ge&ccedil;in.
        </div>
      )}
      <div className="mt-4 space-y-2 rounded-xl bg-white p-6 text-gray-900 shadow">
        <p>
          <strong>Firma:</strong> {company?.name ?? "-"}
        </p>
        <p>
          <strong>Kullanıcı:</strong> {profile?.full_name ?? "-"}
        </p>
        <p>
          <strong>Rol:</strong> {profile?.role ?? "-"}
        </p>
        <p>
          <strong>Abonelik:</strong> {company?.subscription_status ?? "-"}
        </p>
        <p>
          <strong>Bitiş:</strong>{" "}
          {company?.subscription_ends_at
            ? new Date(company.subscription_ends_at).toLocaleDateString("tr-TR")
            : "-"}
        </p>
      </div>
      <Link
        href="/panel/egitimler"
        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        Eğitimler
      </Link>
      <Link
        href="/panel/sinavlar"
        className="mt-4 ml-2 inline-block rounded bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        Sınavlar
      </Link>
      {profile?.role === "company_admin" && (
        <Link
          href="/panel/personel"
          className="mt-4 ml-2 inline-block rounded bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          Personel
        </Link>
      )}
      <Link
        href="/panel/raporlar"
        className="mt-4 ml-2 inline-block rounded bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        {profile?.role === "company_admin" ? "Raporlar" : "Sonuçlarım"}
      </Link>
      <div>
        <CikisButonu />
      </div>
    </main>
  );
}