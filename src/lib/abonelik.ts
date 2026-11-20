import type { SupabaseClient } from "@supabase/supabase-js";

export async function abonelikAktifMi(
  supabase: SupabaseClient
): Promise<boolean> {
  const { data } = await supabase
    .from("companies")
    .select("subscription_status, subscription_ends_at")
    .maybeSingle();

  if (!data) return false;
  if (!["trial", "active"].includes(data.subscription_status)) return false;
  if (
    data.subscription_ends_at &&
    new Date(data.subscription_ends_at) <= new Date()
  ) {
    return false;
  }
  return true;
}