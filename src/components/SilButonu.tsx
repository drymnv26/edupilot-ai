"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SilButonu({
  id,
  tablo,
}: {
  id: string;
  tablo: "trainings" | "exams" | "questions";
}) {
  const router = useRouter();
  const [hata, setHata] = useState<string | null>(null);
  const [siliniyor, setSiliniyor] = useState(false);

  async function sil() {
    if (
      !window.confirm(
        "Bu kay\u0131t kal\u0131c\u0131 olarak silinecek. Emin misiniz?"
      )
    ) {
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
      setHata("Silinemedi. Bu i\u015flem i\u00e7in yetkiniz olmayabilir.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={sil}
        disabled={siliniyor}
        className="rounded-full border border-red-400/40 px-4 py-1.5 text-sm text-red-300 transition-colors hover:bg-red-950/40 disabled:opacity-50"
      >
        {siliniyor ? "Siliniyor..." : "Sil"}
      </button>
      {hata && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {hata}
        </p>
      )}
    </div>
  );
}