"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TEMALAR = [
  { id: "altin", ad: "Alt\u0131n", renk: "#d9b45b" },
  { id: "gul", ad: "G\u00fcl", renk: "#e4a0b4" },
  { id: "zumrut", ad: "Z\u00fcmr\u00fct", renk: "#5fbf9a" },
  { id: "safir", ad: "Safir", renk: "#6fa8e8" },
  { id: "mor", ad: "Mor", renk: "#b79be6" },
];

export default function TemaSecici({ mevcut }: { mevcut: string }) {
  const router = useRouter();
  const [secili, setSecili] = useState(mevcut);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  async function sec(id: string) {
    if (id === secili || yukleniyor) return;
    setHata("");
    setYukleniyor(true);
    const supabase = createClient();
    const { error } = await supabase.rpc("set_company_theme", { p_theme: id });
    if (error) {
      setHata(error.message);
    } else {
      setSecili(id);
      router.refresh();
    }
    setYukleniyor(false);
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {TEMALAR.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => sec(t.id)}
            disabled={yukleniyor}
            aria-pressed={secili === t.id}
            className={
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-50 " +
              (secili === t.id
                ? "border-blush text-ivory"
                : "border-line text-mist hover:text-ivory")
            }
          >
            <span
              className="inline-block h-4 w-4 rounded-full"
              style={{ backgroundColor: t.renk }}
            />
            {t.ad}
          </button>
        ))}
      </div>
      {hata && (
        <p role="alert" className="text-sm text-red-300">
          {hata}
        </p>
      )}
    </div>
  );
}