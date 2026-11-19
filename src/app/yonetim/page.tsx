import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlatformAdminUser } from "@/lib/platform-admin";
import AbonelikFormu from "@/components/AbonelikFormu";

type Firma = {
  id: string;
  name: string;
  subscription_status: string;
  subscription_ends_at: string | null;
  created_at: string;
};

export default async function YonetimSayfasi() {
  const user = await getPlatformAdminUser();

  // Yetkisiz herkes için sayfa yokmuş gibi davranır
  if (!user) {
    notFound();
  }

  const admin = createAdminClient();

  const { data: companyData } = await admin
    .from("companies")
    .select("id, name, subscription_status, subscription_ends_at, created_at")
    .order("created_at", { ascending: false });

  const companies = (companyData ?? []) as Firma[];

  const { data: profileData } = await admin
    .from("profiles")
    .select("company_id");

  const userCounts = new Map<string, number>();
  (profileData ?? []).forEach((p) => {
    userCounts.set(p.company_id, (userCounts.get(p.company_id) ?? 0) + 1);
  });

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Platform Yönetimi
        </h1>
        <p className="text-sm text-gray-600">
          {companies.length} firma · Abonelikleri buradan yönetin.
        </p>
      </div>

      <div className="space-y-4">
        {companies.map((c) => (
          <div key={c.id} className="rounded-xl bg-white p-4 shadow">
            <p className="font-semibold text-gray-900">{c.name}</p>
            <p className="text-xs text-gray-500">
              Kullanıcı sayısı: {userCounts.get(c.id) ?? 0} · Kayıt:{" "}
              {new Date(c.created_at).toLocaleDateString("tr-TR", {
                timeZone: "Europe/Istanbul",
              })}
            </p>
            <AbonelikFormu
              companyId={c.id}
              status={c.subscription_status}
              endsAt={
                c.subscription_ends_at
                  ? new Date(c.subscription_ends_at).toLocaleDateString(
                      "sv-SE",
                      { timeZone: "Europe/Istanbul" }
                    )
                  : ""
              }
            />
          </div>
        ))}
      </div>
    </main>
  );
}