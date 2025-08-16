import { useState } from "react";
import { siteConfig, getDynamicSupportEmail } from "@/config/site";
import { useSettings } from "@/hooks/useSettings";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export const FAQSection = () => {
  const { settings } = useSettings();
  const brandName = settings.brand_name || siteConfig.name;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: `How does ${brandName} work?`,
      answer: `${brandName} connects you with verified moving companies in your area. Simply submit your moving requirements, receive multiple quotes, compare prices and services, and choose the best mover for your needs. We handle the entire process to make your move hassle-free.`,
    },
    {
      question: "Are all moving companies on your platform verified?",
      answer:
        "Yes, all moving companies on our platform undergo thorough verification including license checks, insurance validation, and background verification. We only partner with reputable, professional movers to ensure your safety and satisfaction.",
    },
    {
      question: "How do I get quotes from multiple movers?",
      answer:
        "Simply fill out our quick quote form with your moving details including pickup and delivery locations, moving date, and inventory. Our system will automatically send your request to relevant movers who will provide competitive quotes within hours.",
    },
    {
      question: "Is there any cost to use your service?",
      answer: `No, our service is completely free for customers. You can get quotes, compare movers, and book services without any charges. We earn commission from moving companies only when you successfully book through our platform.`,
    },
    {
      question: "What if I'm not satisfied with the moving company's service?",
      answer: `${brandName} provides comprehensive customer protection. If you face any issues, our dedicated support team will investigate and take appropriate action including mediation, penalties against the mover, or helping you find alternative solutions.`,
    },
    {
      question: "How far in advance should I book my move?",
      answer:
        "We recommend booking your move at least 2-4 weeks in advance, especially during peak seasons (summer months and end/beginning of month). However, our network can often accommodate last-minute moves based on availability.",
    },
    {
      question: "What information do I need to provide for an accurate quote?",
      answer:
        "For the most accurate quote, provide detailed information including: exact pickup and delivery addresses, moving date, list of items to be moved, any special requirements (stairs, elevators, fragile items), and preferred time slots.",
    },
    {
      question: "Can I track my move in real-time?",
      answer:
        "Yes, many of our partnered movers provide real-time tracking services. You'll receive updates on your move status, and our customer support team is available 24/7 to provide assistance and updates throughout your moving day.",
    },
    {
      question: "What happens if my items are damaged during the move?",
      answer:
        "All our verified movers carry proper insurance coverage. In case of damage, report it immediately to both the moving company and our support team. We'll help facilitate the claims process and ensure you receive appropriate compensation.",
    },
    {
      question: "Do you handle both local and long-distance moves?",
      answer: `Yes, ${brandName} supports both local and long-distance moves across the country. Our network includes specialized movers for different types of relocations, from apartment moves to corporate relocations.`,
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our moving services and
            platform. Can't find what you're looking for? Contact our support
            team.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white border border-blue-100 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our friendly support team is here to help you with any questions
              or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${
                  settings.support_phone || siteConfig.supportPhone
                }`}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Call Support
              </a>
              <a
                href={`mailto:${
                  settings.support_email ||
                  getDynamicSupportEmail(settings.brand_name)
                }`}
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
