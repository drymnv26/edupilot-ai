import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TemaSecici from "@/components/TemaSecici";

export default async function GorunumSayfasi() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/giris");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "company_admin") {
    redirect("/panel");
  }

  const { data: firma } = await supabase
    .from("companies")
    .select("theme")
    .eq("id", profile.company_id)
    .maybeSingle();

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
          <h1 className="mt-2 font-display text-5xl">G&ouml;r&uuml;n&uuml;m</h1>
          <p className="mt-2 text-sm text-mist">
            Firman&#305;z&#305;n vurgu rengini se&ccedil;in. Personeliniz de bu
            rengi g&ouml;r&uuml;r.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <TemaSecici mevcut={firma?.theme ?? "altin"} />
        </div>
      </div>
    </main>
  );
}