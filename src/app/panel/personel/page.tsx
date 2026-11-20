import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PersonelFormu from "@/components/PersonelFormu";
import SifreYenile from "@/components/SifreYenile";

type Kisi = {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
};

export default async function PersonelSayfasi() {
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

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: true });

  const people: Kisi[] = data ?? [];

  return (
    <main className="min-h-screen bg-ink text-ivory"><div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link href="/panel" className="block text-sm text-mist underline underline-offset-4 hover:text-ivory">
          ← Panele dön
        </Link>
        <h1 className="mt-3 font-display text-5xl">Personel</h1>
      </div>

      <PersonelFormu />

      <div className="space-y-3">
        {people.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-display text-2xl">{p.full_name ?? "-"}</p>
            <p className="mt-1 text-sm text-mist">
              {p.role === "company_admin" ? "Yönetici" : "Personel"}
            </p>
          {p.role !== "company_admin" && <SifreYenile userId={p.id} />}
          </div>
        ))}
      </div>
    </div></main>
  );
}