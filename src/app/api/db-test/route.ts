import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("companies").select("id");

  if (error) {
    return Response.json({ ok: false, hata: error.message }, { status: 500 });
  }
  return Response.json({ ok: true, satir: data.length });
}