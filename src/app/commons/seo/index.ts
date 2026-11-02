import type { Metadata } from "next";

export function generatePageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beercrew.vn";
  const fullUrl = `${siteUrl}${path}`;

  return {
    title: `${title} | Chốt Kèo Social Planner`,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Chốt Kèo Social Planner",
      locale: "vi_VN",
      type: "website",
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}
