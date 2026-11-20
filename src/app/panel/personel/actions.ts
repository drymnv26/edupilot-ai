"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Sonuc = { ok: boolean; error?: string };

export async function personelEkle(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<Sonuc> {
  const fullName = String(input?.fullName ?? "").trim();
  const email = String(input?.email ?? "").trim().toLowerCase();
  const password = String(input?.password ?? "");

  if (fullName.length < 2) {
    return { ok: false, error: "Ad soyad çok kısa." };
  }
  if (!email.includes("@")) {
    return { ok: false, error: "Geçerli bir e-posta girin." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Şifre en az 8 karakter olmalı." };
  }

  // 1) Çağıran kişi giriş yapmış bir firma yöneticisi mi?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Giriş yapmalısınız." };
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.role !== "company_admin") {
    return { ok: false, error: "Bu işlem için firma yöneticisi olmalısınız." };
  }

  // 2) Yönetici doğrulandı: kullanıcıyı gizli anahtarla oluştur
  const admin = createAdminClient();

  const { count: personelSayisi } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("company_id", me.company_id).eq("role", "employee");
  if ((personelSayisi ?? 0) >= 10) {
    return { ok: false, error: "Paketinizde en fazla 10 personel eklenebilir. Daha fazlas\u0131 i\u00e7in destek@guzellikedu.com adresine yaz\u0131n." };
  }
  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError || !created.user) {
    return {
      ok: false,
      error: createError?.message ?? "Kullanıcı oluşturulamadı.",
    };
  }

  // 3) Profili, yöneticinin kendi firmasına bağla
  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    company_id: me.company_id,
    full_name: fullName,
    role: "employee",
  });

  if (profileError) {
    // Yarım kalan kullanıcıyı geri al
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, error: profileError.message };
  }

  revalidatePath("/panel/personel");
  return { ok: true };
}
export async function personelSifreYenile(input: {
  userId: string;
  password: string;
}): Promise<Sonuc> {
  const userId = String(input?.userId ?? "");
  const password = String(input?.password ?? "");

  if (password.length < 8) {
    return { ok: false, error: "\u015eifre en az 8 karakter olmal\u0131." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Giri\u015f yapmal\u0131s\u0131n\u0131z." };
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("company_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!me || me.role !== "company_admin") {
    return {
      ok: false,
      error: "Bu i\u015flem i\u00e7in firma y\u00f6neticisi olmal\u0131s\u0131n\u0131z.",
    };
  }

  const admin = createAdminClient();

  const { data: hedef } = await admin
    .from("profiles")
    .select("company_id, role")
    .eq("id", userId)
    .maybeSingle();

  if (!hedef || hedef.company_id !== me.company_id || hedef.role !== "employee") {
    return { ok: false, error: "Bu personel bulunamad\u0131." };
  }

  const { error } = await admin.auth.admin.updateUserById(userId, { password });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}