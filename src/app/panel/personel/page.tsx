import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PersonelFormu from "@/components/PersonelFormu";

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
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link href="/panel" className="text-sm text-blue-600 underline">
          ← Panele dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Personel</h1>
      </div>

      <PersonelFormu />

      <div className="space-y-3">
        {people.map((p) => (
          <div key={p.id} className="rounded-xl bg-white p-4 shadow">
            <p className="font-semibold text-gray-900">{p.full_name ?? "-"}</p>
            <p className="text-xs text-gray-500">
              {p.role === "company_admin" ? "Yönetici" : "Personel"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}