import { siteConfig } from "@/config/site";
import { useSettings } from "@/hooks/useSettings";
import { ShieldCheck, Stars, Timer, Globe2 } from "lucide-react";

export const WhyChooseSection = () => {
  const { settings } = useSettings();
  const brandName = settings.brand_name || siteConfig.name;

  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Movers",
      description:
        "All listed companies are vetted for licenses, insurance, and service quality.",
    },
    {
      icon: Stars,
      title: "Trusted Reviews",
      description:
        "Real customer ratings help you compare movers with confidence.",
    },
    {
      icon: Timer,
      title: "Fast Quotes",
      description:
        "Request and receive multiple quotes quickly to save time and money.",
    },
    {
      icon: Globe2,
      title: "Nationwide Coverage",
      description:
        "From local to long-distance, find reliable movers across the country.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose {brandName}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We make moving simple by connecting you with top-rated, verified
            movers and giving you tools to compare quickly and fairly.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
