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
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link
          href="/panel/sinavlar"
          className="text-sm text-blue-600 underline"
        >&larr; S&#305;navlara d&ouml;n</Link>
      </div>
      <SinavDuzenleFormu
        id={exam.id}
        title={exam.title}
        passScore={exam.pass_score}
        isPublished={exam.is_published}
      />
    </main>
  );
}