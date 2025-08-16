import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { Auth } from "@/pages/Auth";
import { Admin } from "@/pages/Admin";
import { Quote } from "@/pages/Quote";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/hooks/useAuth";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { CompanyDashboard } from "@/pages/CompanyDashboard";
import { CompanyPlans } from "@/pages/CompanyPlans";
import { LandingPPC } from "@/pages/LandingPPC";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/hooks/useSettings";
import { siteConfig } from "@/config/site";

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export const App = () => {
  const { settings } = useSettings();
  const brand = settings.brand_name || siteConfig.name;
  const description = siteConfig.description;
  const title = `${brand} – Find Your Perfect Mover & Packer Partner`;

  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/company-plans" element={<CompanyPlans />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/landing-ppc" element={<LandingPPC />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};
