import { HeroSection } from "@/components/home/HeroSection";
import { CompanyListings } from "@/components/home/CompanyListings";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { PlansSection } from "@/components/home/BidSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { HelpSection } from "@/components/home/HelpSection";
import { FAQSection } from "@/components/home/FAQSection";

export const Home = () => {
  return (
    <div>
      <HeroSection />
      <CompanyListings />
      <WhyChooseSection />
      <HelpSection />
      <PlansSection />
      <TestimonialSection />
      <FAQSection />
    </div>
  );
};
