import { HeroSection } from "@/components/home/HeroSection";
import { CompanyListings } from "@/components/home/CompanyListings";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { BidSection } from "@/components/home/BidSection";

export const Home = () => {
  return (
    <div>
      <HeroSection />
      <CompanyListings />
      <BidSection />
      <TestimonialSection />
    </div>
  );
};
