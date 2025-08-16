import { AppSettings } from "@/hooks/useSettings";

// Base/fallback configuration
export const baseSiteConfig = {
  name: "SAAWARIYA",
  description:
    "Find and compare top-rated professional movers and packers. Get instant quotes and make your move hassle-free.",
  url: "https://moverankpro.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/moverankpro",
    github: "https://github.com/moverankpro",
  },
  keywords: [
    "movers",
    "packers",
    "moving company",
    "relocation services",
    "professional movers",
    "moving quotes",
    "top rated movers",
    "moving services",
    "packing services",
    "local movers",
    "long distance movers",
  ],
  supportEmail: "support@saawariya.site", // fallback email
  supportPhone: "+1 (555) 123-4567",
  address: "123 Moving Street, Suite 100, New York, NY 10001",
  socialLinks: {
    facebook: "https://facebook.com/moverankpro",
    instagram: "https://instagram.com/moverankpro",
    linkedin: "https://linkedin.com/company/moverankpro",
  },
};

// Dynamic site config that uses database settings
export const getSiteConfig = (settings?: AppSettings) => {
  return {
    ...baseSiteConfig,
    name: settings?.brand_name || baseSiteConfig.name,
    supportEmail:
      settings?.support_email || getDynamicSupportEmail(settings?.brand_name),
    supportPhone: settings?.support_phone || baseSiteConfig.supportPhone,
  };
};

// For backward compatibility
export const siteConfig = baseSiteConfig;

// Helper function to generate dynamic support email
export const getDynamicSupportEmail = (brandName?: string) => {
  if (!brandName) return baseSiteConfig.supportEmail;
  const cleanBrandName = brandName.toLowerCase().replace(/\s+/g, "");
  return `support@${cleanBrandName}.site`;
};
