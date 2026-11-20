import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SinavDuzenleFormu from "@/components/SinavDuzenleFormu";

export default async function SinavDuzenleSayfasi({
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
    redirect("/panel/sinavlar");
  }

  const { data: exam } = await supabase
    .from("exams")
    .select("id, title, pass_score, is_published")
    .eq("id", id)
    .maybeSingle();

  if (!exam) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-ink text-ivory"><div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <Link
          href="/panel/sinavlar"
          className="block text-sm text-mist underline underline-offset-4 hover:text-ivory"
        >&larr; S&#305;navlara d&ouml;n</Link>
      </div>
      <SinavDuzenleFormu
        id={exam.id}
        title={exam.title}
        passScore={exam.pass_score}
        isPublished={exam.is_published}
      />
    </div></main>
  );
}