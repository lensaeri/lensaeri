import { Grain } from "@/components/site/Grain";
import { Intro } from "@/components/site/Intro";
import { Nav } from "@/components/site/Nav";
import { getSettings } from "@/lib/content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Grain />
      <Intro brand={settings.brand_name} location={settings.brand_location} />
      <Nav brand={settings.brand_name} />
      {children}
    </>
  );
}
