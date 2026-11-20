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
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link
          href="/panel/egitimler"
          className="text-sm text-blue-600 underline"
        >&larr; E&#287;itimlere d&ouml;n</Link>
      </div>
      <EgitimDuzenleFormu
        id={training.id}
        title={training.title}
        description={training.description}
        content={training.content}
        isPublished={training.is_published}
      />
    </main>
  );
}