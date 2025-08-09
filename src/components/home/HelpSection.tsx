import { siteConfig } from "@/config/site";
import { useSettings } from "@/hooks/useSettings";
import {
  Headphones,
  CheckCircle,
  Shield,
  Clock,
  Users,
  AlertTriangle,
} from "lucide-react";

export const HelpSection = () => {
  const { settings } = useSettings();
  const brandName = settings.brand_name || siteConfig.name;

  const helpPoints = [
    {
      icon: Headphones,
      title: "Prompt Support from Start to End of your Move",
      description:
        "24/7 dedicated customer support team available to assist you throughout your entire moving journey, from initial booking to final delivery.",
    },
    {
      icon: CheckCircle,
      title: "Regular Quality Maintenance Check",
      description:
        "Continuous monitoring and quality assurance checks to ensure all partnered movers maintain our high standards of service excellence.",
    },
    {
      icon: Shield,
      title: "Taking Appropriate Action Against Movers",
      description:
        "Swift investigation and corrective measures against any mover who fails to meet our standards, including penalties and removal from our platform.",
    },
    {
      icon: Clock,
      title: "Real-time Issue Resolution",
      description:
        "Immediate response system to address any concerns or problems that arise during your move, ensuring quick and effective solutions.",
    },
    {
      icon: Users,
      title: "Dedicated Problem Resolution Team",
      description:
        "Specialized team of experts trained to handle disputes, complaints, and issues between customers and moving companies.",
    },
    {
      icon: AlertTriangle,
      title: "Proactive Risk Management",
      description:
        "Advanced monitoring systems to identify potential issues before they escalate, ensuring smooth and trouble-free moving experiences.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            How {brandName} will Help You in Case of Any Problems
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            We stand by our customers with comprehensive support and protection
            measures, ensuring your moving experience is smooth and worry-free
            from start to finish.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="group bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-blue-100 text-sm">Support Available</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-blue-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-blue-100 text-sm">Customer Protection</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-blue-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">Instant</div>
                <div className="text-blue-100 text-sm">Issue Resolution</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
