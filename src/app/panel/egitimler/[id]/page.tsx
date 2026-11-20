import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function EgitimDetaySayfasi({
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

  const { data: t } = await supabase
    .from("trainings")
    .select("id, title, description, content")
    .eq("id", id)
    .maybeSingle();
  if (!t) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <Link href="/panel/egitimler" className="text-sm text-blue-600 underline">
        &larr; E&#287;itimlere d&ouml;n
      </Link>
      <article className="space-y-3 rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        {t.description && <p className="text-gray-600">{t.description}</p>}
        <hr className="border-gray-200" />
        <div className="whitespace-pre-wrap text-gray-900">
          {t.content || "Bu e\u011fitim i\u00e7in i\u00e7erik girilmemi\u015f."}
        </div>
      </article>
    </main>
  );
}