
import { HeroSection } from '@/components/home/HeroSection';
import { CompanyListings } from '@/components/home/CompanyListings';
import { TestimonialSection } from '@/components/home/TestimonialSection';

export const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CompanyListings />
      <TestimonialSection />
    </div>
  );
};
