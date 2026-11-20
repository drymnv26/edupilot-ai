import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlatformAdminUser } from "@/lib/platform-admin";
import AbonelikFormu from "@/components/AbonelikFormu";
import KodYonetimi from "@/components/KodYonetimi";

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

  const { data: kodData } = await admin
    .from("invite_codes")
    .select("id, code, note, is_active, used_at")
    .order("created_at", { ascending: false });
  const kodlar = kodData ?? [];

  const { data: profileData } = await admin
    .from("profiles")
    .select("company_id");

  const userCounts = new Map<string, number>();
  (profileData ?? []).forEach((p) => {
    userCounts.set(p.company_id, (userCounts.get(p.company_id) ?? 0) + 1);
  });

  return (
    <main className="min-h-screen bg-ink text-ivory"><div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="font-display text-5xl">
          Platform Yönetimi
        </h1>
        <p className="mt-2 text-sm text-mist">
          {companies.length} firma · Abonelikleri buradan yönetin.
        </p>
      </div>

      <KodYonetimi kodlar={kodlar} />

      <div className="space-y-4">
        {companies.map((c) => (
          <div key={c.id} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-display text-2xl">{c.name}</p>
            <p className="mt-1 text-sm text-mist">
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
    </div></main>
  );
}