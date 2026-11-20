"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SilButonu({
  id,
  tablo,
}: {
  id: string;
  tablo: "trainings" | "exams";
}) {
  const router = useRouter();
  const [hata, setHata] = useState<string | null>(null);
  const [siliniyor, setSiliniyor] = useState(false);

  async function sil() {
    if (!window.confirm("Bu kayıt kalıcı olarak silinecek. Emin misin?")) {
      return;
    }
    setHata(null);
    setSiliniyor(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from(tablo)
      .delete()
      .eq("id", id)
      .select("id");

    setSiliniyor(false);

    if (error) {
      setHata("Silinemedi: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      setHata("Silinemedi. Bu işlem için yetkin olmayabilir.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={sil}
        disabled={siliniyor}
        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 disabled:opacity-50"
      >
        {siliniyor ? "Siliniyor..." : "Sil"}
      </button>
      {hata && <p className="mt-1 text-sm text-red-600">{hata}</p>}
    </div>
  );
}