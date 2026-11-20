// CSV text -> rows. Detects "," or ";" and handles quotes, BOM and CRLF.
export function csvOku(metin: string): string[][] {
  const t = metin.replace(/^\uFEFF/, "");
  const ilkSatir = t.split(/\r?\n/)[0] ?? "";
  const noktali = (ilkSatir.match(/;/g) ?? []).length;
  const virgul = (ilkSatir.match(/,/g) ?? []).length;
  const ayirac = noktali > virgul ? ";" : ",";

  const satirlar: string[][] = [];
  let satir: string[] = [];
  let hucre = "";
  let tirnakta = false;

  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (tirnakta) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          hucre += '"';
          i++;
        } else {
          tirnakta = false;
        }
      } else {
        hucre += c;
      }
    } else if (c === '"') {
      tirnakta = true;
    } else if (c === ayirac) {
      satir.push(hucre);
      hucre = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      satir.push(hucre);
      hucre = "";
      satirlar.push(satir);
      satir = [];
    } else {
      hucre += c;
    }
  }
  if (hucre !== "" || satir.length > 0) {
    satir.push(hucre);
    satirlar.push(satir);
  }

  return satirlar
    .filter((s) => s.some((h) => h.trim() !== ""))
    .map((s) => s.map((h) => h.trim()));
}