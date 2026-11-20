"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CikisButonu() {
  const router = useRouter();

  async function cikisYap() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/giris");
    router.refresh();
  }

  return (
    <button
      onClick={cikisYap}
      className="rounded-full border border-line px-4 py-2 text-sm text-mist transition-colors hover:border-blush hover:text-ivory"
    >
      &Ccedil;&#305;k&#305;&#351; yap
    </button>
  );
}