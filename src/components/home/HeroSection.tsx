import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  MapPin,
  Calendar,
  Truck,
  Star,
  Shield,
  Clock,
  ChevronDown,
} from "lucide-react";

export const HeroSection = () => {
  const [selectedCity, setSelectedCity] = useState("");

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Pune",
    "Hyderabad",
    "Ahmedabad",
    "Jaipur",
    "Kochi",
    "Lucknow",
    "Surat",
    "Indore",
    "Bhopal",
    "Nagpur",
    "Other",
  ];

  const handleSearch = () => {
    if (selectedCity) {
      window.location.href = `/movers/${encodeURIComponent(
        selectedCity.toLowerCase()
      )}`;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-orange-300 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-200 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white rounded-full animate-spin-slow"></div>
        <div className="absolute top-32 right-20 w-12 h-12 border-2 border-orange-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 border-2 border-white rounded-full animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading with Animation */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Professional Moving Made
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse">
                {" "}
                Easy
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-6"></div>
          </div>

          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Connect with trusted movers and packers nationwide. Get instant
            quotes, compare services, and book your perfect move today.
          </p>

          {/* Enhanced Search Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto mb-16 border border-white/20">
            <div className="flex gap-6">
              <div className="relative group w-4/5">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors z-10" />
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="pl-12 h-14 text-gray-800 border-2 border-gray-200 focus:border-blue-500 rounded-xl text-lg w-full">
                    <SelectValue placeholder="Choose your city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 p-1">
                    {cities.map((city) => (
                      <SelectItem
                        key={city}
                        value={city}
                        className="text-base py-2 px-3 cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                disabled={!selectedCity}
                className="h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-1/5 min-w-fit"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Movers
              </Button>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              Select your city • Free quotes • No obligations
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/80 rounded-full mb-4 group-hover:bg-blue-500 transition-colors">
                <Truck className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-blue-100">Verified Movers</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600/80 rounded-full mb-4 group-hover:bg-orange-500 transition-colors">
                <Star className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-2">4.8/5</h3>
              <p className="text-blue-100">Average Rating</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600/80 rounded-full mb-4 group-hover:bg-blue-500 transition-colors">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-2">10K+</h3>
              <p className="text-blue-100">Successful Moves</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-600/80 rounded-full mb-4 group-hover:bg-orange-500 transition-colors">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-2">24/7</h3>
              <p className="text-blue-100">Support</p>
            </div>
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Shield className="w-12 h-12 text-orange-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-blue-100">
                All our movers are fully licensed and insured for your peace of
                mind
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Clock className="w-12 h-12 text-orange-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Instant Quotes</h3>
              <p className="text-blue-100">
                Get multiple quotes instantly and compare prices from top movers
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Star className="w-12 h-12 text-orange-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Best Rated</h3>
              <p className="text-blue-100">
                Only the highest-rated movers make it to our platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  );
};
