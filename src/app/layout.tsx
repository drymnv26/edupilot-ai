import type { Metadata } from "next";
import { Figtree, Instrument_Serif } from "next/font/google";
import "./globals.css";

const govde = Figtree({
  variable: "--font-govde",
  subsets: ["latin", "latin-ext"],
});

const baslik = Instrument_Serif({
  variable: "--font-baslik",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "G\u00fczellik Akademisi",
  description:
    "Personel e\u011fitimlerini ve s\u0131navlar\u0131n\u0131 tek yerden y\u00f6netin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${govde.variable} ${baslik.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}