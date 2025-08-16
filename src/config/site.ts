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
  supportPhone: "+91 99909 03875",
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

// Helper function to mask phone number for display
export const maskPhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return "";
  // Remove all non-digit characters to find the actual digits
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length < 3) return phoneNumber;

  // Show first 3 digits + *** while preserving original format structure
  const firstThree = digits.substring(0, 3);
  const maskedDigits = firstThree + "***";

  // Replace the digits in the original format with masked version
  let result = phoneNumber;
  let digitIndex = 0;
  let maskedIndex = 0;

  for (let i = 0; i < phoneNumber.length; i++) {
    if (/\d/.test(phoneNumber[i])) {
      if (maskedIndex < maskedDigits.length) {
        result =
          result.substring(0, i) +
          maskedDigits[maskedIndex] +
          result.substring(i + 1);
        maskedIndex++;
      } else {
        result = result.substring(0, i) + "*" + result.substring(i + 1);
      }
      digitIndex++;
    }
  }

  return result;
};
