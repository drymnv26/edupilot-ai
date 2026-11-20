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
    <main className="min-h-screen bg-ink text-ivory">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Link
          href="/panel/egitimler"
          className="block text-sm text-mist underline underline-offset-4 hover:text-ivory"
        >
          &larr; E&#287;itimlere d&ouml;n
        </Link>
        <article className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
          <h1 className="font-display text-4xl sm:text-5xl">{t.title}</h1>
          {t.description && (
            <p className="mt-3 text-lg text-mist">{t.description}</p>
          )}
          <hr className="my-6 border-line" />
          <div className="max-w-prose whitespace-pre-wrap text-base leading-8 text-ivory">
            {t.content || "Bu e\u011fitim i\u00e7in i\u00e7erik girilmemi\u015f."}
          </div>
        </article>
      </div>
    </main>
  );
}