"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlatformAdminUser } from "@/lib/platform-admin";

const DURUMLAR = ["trial", "active", "expired", "suspended"];

type Sonuc = { ok: boolean; error?: string };

export async function abonelikGuncelle(input: {
  companyId: string;
  status: string;
  endsAt: string;
}): Promise<Sonuc> {
  const companyId = String(input?.companyId ?? "");
  const status = String(input?.status ?? "");
  const endsAtRaw = String(input?.endsAt ?? "").trim();

  // Her işlemde yetkiyi yeniden doğrula
  const user = await getPlatformAdminUser();
  if (!user) {
    return { ok: false, error: "Bu işlem için yetkiniz yok." };
  }

  if (!DURUMLAR.includes(status)) {
    return { ok: false, error: "Geçersiz abonelik durumu." };
  }

  let endsAt: string | null = null;
  if (endsAtRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(endsAtRaw)) {
      return { ok: false, error: "Tarih biçimi geçersiz." };
    }
    const d = new Date(`${endsAtRaw}T23:59:59+03:00`);
    if (isNaN(d.getTime())) {
      return { ok: false, error: "Tarih geçersiz." };
    }
    endsAt = d.toISOString();
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("companies")
    .update({ subscription_status: status, subscription_ends_at: endsAt })
    .eq("id", companyId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/yonetim");
  return { ok: true };
}