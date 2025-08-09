import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Menu, X, User } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const [companyProfile, setCompanyProfile] = useState<{ name: string } | null>(
    null
  );
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (user && !isAdmin) {
        const { data, error } = await supabase
          .from("companies")
          .select("name")
          .eq("user_id", user.id)
          .single();
        if (!error && data) setCompanyProfile(data);
        else setCompanyProfile(null);
      } else {
        setCompanyProfile(null);
      }
    };
    fetchCompanyProfile();
  }, [user, isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (companyProfile) return "/company";
    return "/dashboard";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>{settings.support_phone || siteConfig.supportPhone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{settings.support_email || siteConfig.supportEmail}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Professional Moving Services Nationwide</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                M
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {settings.brand_name || siteConfig.name}
              </h1>
              <p className="text-sm text-gray-600">
                Professional Movers & Packers
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/quote"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Get Quote
            </Link>
            <Link
              to="/company-plans"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Plans
            </Link>
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {isAdmin ? (
                    "Admin Panel"
                  ) : companyProfile ? (
                    <span className="inline-flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold">
                        {companyProfile.name}
                      </span>
                    </span>
                  ) : (
                    "Dashboard"
                  )}
                </Link>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/auth?mode=signup">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Join as Company
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/quote"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Get Quote
              </Link>
              <Link
                to="/company-plans"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Plans
              </Link>
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    {isAdmin ? (
                      "Admin Panel"
                    ) : companyProfile ? (
                      <span className="inline-flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">
                          {companyProfile.name}
                        </span>
                      </span>
                    ) : (
                      "Dashboard"
                    )}
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="w-fit"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/auth?mode=signup" className="w-fit">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Join as Company
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
