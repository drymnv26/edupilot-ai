"use server";

import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlatformAdminUser } from "@/lib/platform-admin";

type Sonuc = { ok: boolean; mesaj?: string };

const HARFLER = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function yeniKod() {
  let s = "";
  for (let i = 0; i < 8; i++) s += HARFLER[randomInt(HARFLER.length)];
  return s;
}

export async function kodUret(note: string): Promise<Sonuc> {
  const user = await getPlatformAdminUser();
  if (!user) return { ok: false, mesaj: "Yetkiniz yok" };
  const admin = createAdminClient();
  const { error } = await admin
    .from("invite_codes")
    .insert({ code: yeniKod(), note: note.trim() || null });
  if (error) return { ok: false, mesaj: error.message };
  revalidatePath("/yonetim");
  return { ok: true };
}

export async function kodAktifDegistir(id: string, aktif: boolean): Promise<Sonuc> {
  const user = await getPlatformAdminUser();
  if (!user) return { ok: false, mesaj: "Yetkiniz yok" };
  const admin = createAdminClient();
  const { error } = await admin
    .from("invite_codes")
    .update({ is_active: aktif })
    .eq("id", id);
  if (error) return { ok: false, mesaj: error.message };
  revalidatePath("/yonetim");
  return { ok: true };
}

export async function kodSil(id: string): Promise<Sonuc> {
  const user = await getPlatformAdminUser();
  if (!user) return { ok: false, mesaj: "Yetkiniz yok" };
  const admin = createAdminClient();
  const { error } = await admin.from("invite_codes").delete().eq("id", id);
  if (error) return { ok: false, mesaj: error.message };
  revalidatePath("/yonetim");
  return { ok: true };
}