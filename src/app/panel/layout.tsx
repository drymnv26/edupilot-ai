import { createClient } from "@/lib/supabase/server";

const TEMALAR = ["altin", "gul", "zumrut", "safir", "mor"];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let tema = "altin";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.company_id) {
      const { data: firma } = await supabase
        .from("companies")
        .select("theme")
        .eq("id", profile.company_id)
        .maybeSingle();

      if (firma?.theme && TEMALAR.includes(firma.theme)) {
        tema = firma.theme;
      }
    }
  }

  return <div data-theme={tema}>{children}</div>;
}