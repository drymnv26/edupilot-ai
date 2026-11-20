"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { csvOku } from "@/lib/csv";

type Tur = "egitim" | "soru";
type Istemci = ReturnType<typeof createClient>;
type Satir = { sinav: string; soru: string; siklar: string[]; dogru: number };

const HARF: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const ENBUYUK_BOYUT = 500 * 1024;
const ENCOK_SATIR = 500;

function anahtar(s: string) {
  return s.trim().toLocaleLowerCase("tr");
}

async function egitimYukle(supabase: Istemci, satirlar: string[][]) {
  const kayitlar = satirlar.map((s, i) => {
    const [baslik = "", aciklama = "", icerik = ""] = s;
    if (!baslik) throw new Error(`Sat\u0131r ${i + 2}: ba\u015fl\u0131k bo\u015f.`);
    return {
      title: baslik,
      description: aciklama,
      content: icerik,
      is_published: true,
    };
  });
  const { error } = await supabase.from("trainings").insert(kayitlar);
  if (error) throw new Error(error.message);
  return `${kayitlar.length} e\u011fitim eklendi.`;
}
async function soruYukle(supabase: Istemci, satirlar: string[][]) {
  const liste: Satir[] = satirlar.map((s, i) => {
    const [sinav = "", soru = "", a = "", b = "", c = "", d = "", harf = ""] = s;
    const no = i + 2;
    if (!sinav || !soru) {
      throw new Error(`Sat\u0131r ${no}: s\u0131nav ad\u0131 ve soru dolu olmal\u0131.`);
    }
    const siklar = [a, b, c, d];
    if (siklar.some((x) => !x)) {
      throw new Error(`Sat\u0131r ${no}: 4 \u015f\u0131kk\u0131n hepsi dolu olmal\u0131.`);
    }
    const dogru = HARF[harf.toUpperCase()];
    if (dogru === undefined) {
      throw new Error(`Sat\u0131r ${no}: do\u011fru cevap A, B, C veya D olmal\u0131.`);
    }
    return { sinav, soru, siklar, dogru };
  });

  const { data: mevcut, error: e1 } = await supabase
    .from("exams")
    .select("id, title");
  if (e1) throw new Error(e1.message);

  const sinavId = new Map<string, string>();
  (mevcut ?? []).forEach((x) => sinavId.set(anahtar(x.title), x.id));

  const yeniBasliklar: string[] = [];
  liste.forEach((x) => {
    const k = anahtar(x.sinav);
    if (!sinavId.has(k) && !yeniBasliklar.some((y) => anahtar(y) === k)) {
      yeniBasliklar.push(x.sinav);
    }
  });
  const yeniIdler: string[] = [];
  if (yeniBasliklar.length > 0) {
    const { data: yeni, error: e2 } = await supabase
      .from("exams")
      .insert(
        yeniBasliklar.map((t) => ({ title: t, pass_score: 60, is_published: false }))
      )
      .select("id, title");
    if (e2 || !yeni) throw new Error(e2?.message ?? "S\u0131nav olu\u015fturulamad\u0131.");
    yeni.forEach((x) => {
      sinavId.set(anahtar(x.title), x.id);
      yeniIdler.push(x.id);
    });
  }

  async function geriAl() {
    if (yeniIdler.length > 0) {
      await supabase.from("exams").delete().in("id", yeniIdler);
    }
  }

  const idler = Array.from(new Set(liste.map((x) => sinavId.get(anahtar(x.sinav))!)));
  const { data: pozlar } = await supabase
    .from("questions")
    .select("exam_id, position")
    .in("exam_id", idler);
  const sonPoz = new Map<string, number>();
  (pozlar ?? []).forEach((p) =>
    sonPoz.set(p.exam_id, Math.max(sonPoz.get(p.exam_id) ?? 0, p.position))
  );

  const eklenecek = liste.map((x) => {
    const id = sinavId.get(anahtar(x.sinav))!;
    const poz = (sonPoz.get(id) ?? 0) + 1;
    sonPoz.set(id, poz);
    return { id, poz, soru: x.soru, siklar: x.siklar, dogru: x.dogru };
  });
  const { data: eklenen, error: e3 } = await supabase
    .from("questions")
    .insert(
      eklenecek.map((x) => ({
        exam_id: x.id,
        question_text: x.soru,
        options: x.siklar,
        position: x.poz,
      }))
    )
    .select("id, exam_id, position");
  if (e3 || !eklenen) {
    await geriAl();
    throw new Error(e3?.message ?? "Sorular eklenemedi.");
  }

  const dogruHaritasi = new Map<string, number>();
  eklenecek.forEach((x) => dogruHaritasi.set(x.id + ":" + x.poz, x.dogru));

  const { error: e4 } = await supabase.from("question_keys").insert(
    eklenen.map((q) => ({
      question_id: q.id,
      correct_index: dogruHaritasi.get(q.exam_id + ":" + q.position) ?? 0,
    }))
  );
  if (e4) {
    await supabase.from("questions").delete().in("id", eklenen.map((q) => q.id));
    await geriAl();
    throw new Error(e4.message);
  }

  return (
    `${eklenen.length} soru eklendi` +
    (yeniIdler.length > 0
      ? `, ${yeniIdler.length} yeni s\u0131nav (taslak) olu\u015fturuldu.`
      : ".")
  );
}
export default function CsvYukle({ tur }: { tur: Tur }) {
  const router = useRouter();
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  async function dosyaSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];
    e.target.value = "";
    if (!dosya) return;

    setMesaj("");
    setHata("");
    if (dosya.size > ENBUYUK_BOYUT) {
      setHata("Dosya \u00e7ok b\u00fcy\u00fck (en fazla 500 KB).");
      return;
    }

    setYukleniyor(true);
    try {
      const satirlar = csvOku(await dosya.text()).slice(1);
      if (satirlar.length === 0) {
        throw new Error("Dosyada ba\u015fl\u0131k sat\u0131r\u0131ndan sonra veri yok.");
      }
      if (satirlar.length > ENCOK_SATIR) {
        throw new Error("En fazla 500 sat\u0131r y\u00fckleyebilirsiniz.");
      }
      const supabase = createClient();
      const sonuc =
        tur === "egitim"
          ? await egitimYukle(supabase, satirlar)
          : await soruYukle(supabase, satirlar);
      setMesaj(sonuc);
      router.refresh();
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Y\u00fckleme ba\u015far\u0131s\u0131z.");
    }
    setYukleniyor(false);
  }
  return (
    <div className="space-y-3">
      <label
        className={
          "inline-block cursor-pointer rounded-full bg-blush px-6 py-3 font-semibold text-ink transition-colors hover:bg-blush-deep focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blush " +
          (yukleniyor ? "pointer-events-none opacity-50" : "")
        }
      >
        {yukleniyor ? "Y\u00fckleniyor..." : "CSV dosyas\u0131 se\u00e7"}
        <input
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          onChange={dosyaSecildi}
          disabled={yukleniyor}
        />
      </label>
      {mesaj && (
        <p role="status" className="text-sm text-emerald-300">
          {mesaj}
        </p>
      )}
      {hata && (
        <p role="alert" className="text-sm text-red-300">
          {hata}
        </p>
      )}
    </div>
  );
}