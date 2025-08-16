import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Star,
  MapPin,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Home,
  Building2,
  Truck,
  Warehouse,
  MessageCircle,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { siteConfig, getDynamicSupportEmail } from "@/config/site";

export const LandingPPC = () => {
  const { settings } = useSettings();
  const brandName = settings.brand_name || siteConfig.name;
  const supportPhone = settings.support_phone || siteConfig.supportPhone;
  const supportEmail =
    settings.support_email || getDynamicSupportEmail(settings.brand_name);

  // Import hero image from public folder
  const heroImage = "/hero-image.jpg"; // Assuming hero image is in public folder

  const handleCallNow = () => {
    window.location.href = `tel:${supportPhone}`;
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in your moving services. Please provide me with a quote.`;
    const phoneNumber = supportPhone.replace(/[^\d]/g, ""); // Remove non-digits
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${supportEmail}?subject=Moving Service Inquiry&body=Hi, I'm interested in your moving services. Please provide me with a quote.`;
  };

  const features = [
    {
      icon: Shield,
      title: "Safety & Security",
      description:
        "Premium packing materials including bubble wrap, corrugated sheets, and sturdy containers",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "Dedicated crew of educated specialists ensuring professional handling",
    },
    {
      icon: Clock,
      title: "Punctual Service",
      description: "Commitment to timely delivery with real-time tracking",
    },
    {
      icon: Star,
      title: "Customer Satisfaction",
      description:
        "Transparent pricing with no hidden charges and 24/7 support",
    },
  ];

  const services = [
    "Disassembling and reassembling furniture",
    "Careful loading and transportation",
    "Fragile items handling with precision",
    "Real-time tracking and updates",
    "24/7 customer service support",
    "Secure warehousing facilities",
  ];

  const movingServices = [
    {
      icon: Home,
      title: "Domestic Relocation",
      description:
        "Safe and secure household shifting services with professional packing and unpacking.",
      features: [
        "Professional Packing",
        "Safe Transportation",
        "Unpacking Service",
      ],
    },
    {
      icon: Building2,
      title: "Office Moving",
      description:
        "Minimize business downtime with our efficient corporate relocation solutions.",
      features: ["IT Equipment Care", "Minimal Downtime", "Setup Assistance"],
    },
    {
      icon: Truck,
      title: "Car Transportation",
      description:
        "Door-to-door vehicle transportation with complete insurance coverage.",
      features: ["Damage-Free Transit", "Full Insurance", "Real-time Tracking"],
    },
    {
      icon: Warehouse,
      title: "Warehousing Solutions",
      description:
        "Secure storage facilities for your belongings with 24/7 surveillance.",
      features: ["Climate Controlled", "24/7 Security", "Flexible Duration"],
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">
                Trusted by 10,000+ Customers
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Professional
              <span className="block text-yellow-300"> Packers & Movers</span>
              in Delhi
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {brandName} - Your trusted partner for safe, reliable, and
              hassle-free relocation services across India
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleCallNow}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 text-lg rounded-xl"
                size="lg"
              >
                <Phone className="w-6 h-6 mr-2" />
                Call Now: {supportPhone}
              </Button>
              <Button
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg rounded-xl"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("quote")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get Free Quote
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">
                  10+
                </div>
                <div className="text-sm opacity-80">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">
                  10,000+
                </div>
                <div className="text-sm opacity-80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">
                  24/7
                </div>
                <div className="text-sm opacity-80">Customer Support</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{supportEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Delhi & Across India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                About {brandName}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A trusted name in the relocation industry, providing top-notch
                packing and moving services in Delhi and across India.
              </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Recognized for Professionalism & Consumer-Centric Approach
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {brandName} is a reliable name within the relocation industry,
                  providing top-notch packing and transferring services in Delhi
                  and across India. Recognized for their professionalism and
                  consumer-centric approach, we focus on domestic relocation,
                  workplace moving, car transportation, and warehousing
                  solutions.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  With years of experience and a dedicated crew of educated
                  specialists, we ensure a trouble-free moving experience for
                  individuals, households, and businesses alike. Our commitment
                  to safety and punctuality sets us apart in the industry.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We use premium packing materials including bubble wrap,
                  corrugated sheets, stretch film, and sturdy containers to
                  protect valuable belongings during transit. Our team handles
                  everything from disassembling furniture to careful loading,
                  transportation, and reassembling at the new destination.
                </p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-6">
                  Our Key Strengths
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Detail */}
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Customer Satisfaction is Our Priority
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We provide personalized relocation plans tailored to each
                    client's specific needs and budget. Our transparent pricing
                    policy, without hidden expenses, builds trust with clients
                    and sets us apart from many other service providers.
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Whether it's fragile crockery or bulky furniture, each item
                    is treated with care and precision. Real-time monitoring and
                    24/7 customer service ensure that clients are always
                    informed and comfortable during the shifting process.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      What Sets Us Apart:
                    </h4>
                    <ul className="space-y-2">
                      {services.map((service, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      Vehicle Transportation Services
                    </h4>
                    <p className="text-gray-600 mb-4">
                      In addition to residential and commercial moves, we
                      provide reliable vehicle and motorbike transportation
                      services. Using specifically designed carriers, we ensure
                      safe and damage-free delivery of vehicles across cities
                      and states.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      Secure Warehousing Facilities
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Our warehousing and storage facilities are secure, clean,
                      and equipped with surveillance systems, making them ideal
                      for customers who require temporary storage during the
                      moving process.
                    </p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-lg p-6">
                    <h4 className="text-xl font-bold mb-4">Why Choose Us?</h4>
                    <p className="opacity-90">
                      Located in Delhi, we serve a wide customer base across NCR
                      and beyond. Our local expertise, efficient logistics, and
                      focus on client care make us a preferred choice for
                      hundreds of satisfied clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-12">
              <h3 className="text-3xl font-bold mb-4">
                Choose Reliability, Efficiency, and Care
              </h3>
              <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Our growing reputation is backed by positive reviews and repeat
                clients who trust us with their valuable assets. From a small
                apartment move within Delhi to a large-scale office relocation
                across India, we deliver consistency, quality, and peace of
                mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = `tel:${supportPhone}`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg"
                >
                  Call {supportPhone}
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("quote")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
                >
                  Get Free Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Moving Services Section */}
      <section className="py-20 bg-white" id="services">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Moving Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive relocation solutions tailored to meet your specific
              needs with professional expertise and reliable service.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {movingServices.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-xl p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Why Choose {brandName}?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 rounded-lg p-2 mt-1">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        100% Safe & Secure
                      </h4>
                      <p className="text-gray-600">
                        Professional handling with comprehensive insurance
                        coverage for all your belongings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 rounded-lg p-2 mt-1">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        On-Time Delivery
                      </h4>
                      <p className="text-gray-600">
                        Committed to delivering your goods safely within the
                        promised timeframe.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 rounded-lg p-2 mt-1">
                      <Truck className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Professional Team
                      </h4>
                      <p className="text-gray-600">
                        Trained and experienced professionals dedicated to
                        providing excellent service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="bg-blue-50 rounded-xl p-8">
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">
                    Ready to Move?
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Get instant quote and professional assistance for your
                    relocation needs.
                  </p>
                  <Button
                    onClick={handleCallNow}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg"
                    size="lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call {supportPhone}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Your Free Quote Section */}
      <section className="py-20 bg-blue-600 text-white" id="quote">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get Your Free Quote Today
              </h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Contact {brandName} now for a personalized quote and experience
                stress-free relocation services.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Call Us Now</h4>
                        <a
                          href={`tel:${supportPhone}`}
                          className="text-yellow-300 text-lg font-bold hover:underline"
                        >
                          {supportPhone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Email Us</h4>
                        <a
                          href={`mailto:${supportEmail}`}
                          className="text-yellow-300 hover:underline"
                        >
                          {supportEmail}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Service Areas</h4>
                        <p className="opacity-90">Delhi & Across India</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 rounded-lg p-3">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Working Hours</h4>
                        <p className="opacity-90">24/7 Customer Support</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h4 className="text-xl font-bold mb-4">
                    Why Customers Choose Us
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        10+
                      </div>
                      <div className="text-sm opacity-80">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        10K+
                      </div>
                      <div className="text-sm opacity-80">Happy Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        100%
                      </div>
                      <div className="text-sm opacity-80">Safe Moving</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        24/7
                      </div>
                      <div className="text-sm opacity-80">Support</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6">
                  Ready to Move? Let's Talk!
                </h3>
                <p className="mb-8 opacity-90">
                  Get an instant quote by calling us or send us your
                  requirements. Our expert team is ready to assist you with all
                  your moving needs.
                </p>
                <div className="space-y-4">
                  <Button
                    onClick={handleCallNow}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-4 text-lg rounded-lg"
                    size="lg"
                  >
                    <Phone className="w-6 h-6 mr-2" />
                    Call Now: {supportPhone}
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp Us
                  </Button>
                  <Button
                    onClick={handleEmailClick}
                    className="w-full border-2 border-white/30 text-white bg-white/10 font-bold px-6 py-3 rounded-lg"
                    variant="outline"
                    size="lg"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Send Email
                  </Button>
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-center opacity-80">
                    <strong>Free Consultation Available</strong>
                    <br />
                    No hidden charges • Professional packing • Insured
                    transportation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
