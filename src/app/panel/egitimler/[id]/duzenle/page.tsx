import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EgitimDuzenleFormu from "@/components/EgitimDuzenleFormu";

export default async function EgitimDuzenleSayfasi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
    redirect("/panel/egitimler");
  }
  const { data: training } = await supabase
    .from("trainings")
    .select("id, title, description, content, is_published")
    .eq("id", id)
    .maybeSingle();
  if (!training) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ink text-ivory">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Link
          href="/panel/egitimler"
          className="block text-sm text-mist underline underline-offset-4 hover:text-ivory"
        >
          &larr; E&#287;itimlere d&ouml;n
        </Link>
        <EgitimDuzenleFormu
          id={training.id}
          title={training.title}
          description={training.description}
          content={training.content}
          isPublished={training.is_published}
        />
      </div>
    </main>
  );
}