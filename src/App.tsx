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

const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/quote" element={<Quote />} />
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
