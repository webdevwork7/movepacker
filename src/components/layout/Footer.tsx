import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import {
  siteConfig,
  getDynamicSupportEmail,
  maskPhoneNumber,
} from "@/config/site";
import { useSettings } from "@/hooks/useSettings";

export const Footer = () => {
  const { settings } = useSettings();
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* reduced to 3 columns */}
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                  {(settings.brand_name || siteConfig.name)
                    .charAt(0)
                    .toUpperCase()}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {settings.brand_name || siteConfig.name}
                </h3>
                <p className="text-sm text-gray-400">Professional Movers</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for professional moving and packing services
              nationwide.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/quote"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Get Quote
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/auth?mode=signup"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Join as Company
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">
                  {maskPhoneNumber(
                    settings.support_phone || siteConfig.supportPhone
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">
                  {settings.support_email ||
                    getDynamicSupportEmail(settings.brand_name)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Nationwide Service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 {settings.brand_name || siteConfig.name}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
