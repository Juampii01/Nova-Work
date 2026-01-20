import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://novawork.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/feed", "/marketplace", "/events", "/groups", "/portfolio", "/pricing", "/help"],
        disallow: ["/api/", "/chat", "/dashboard", "/settings", "/verify", "/u/*/edit"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
