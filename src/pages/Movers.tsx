import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/database";

import { HelpSection } from "@/components/home/HelpSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Truck,
  Package,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Shield,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface Plan {
  id: string;
  name: string;
}

export const Movers = () => {
  const { city } = useParams<{ city: string }>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [goldPlanId, setGoldPlanId] = useState<string | null>(null);
  const [platinumPlanId, setPlatinumPlanId] = useState<string | null>(null);
  const [silverPlanId, setSilverPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 10;

  // Quote form states
  const [date, setDate] = useState<Date>();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const cityName = city
    ? city.charAt(0).toUpperCase() + city.slice(1)
    : "Your City";

  const fetchPlansAndCompanies = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch plans
      const { data: plansRaw } = await supabase
        .from("plans")
        .select("id, name");
      const plans: Plan[] = Array.isArray(plansRaw) ? (plansRaw as Plan[]) : [];
      const goldPlan = plans.find((p) => p.name.toLowerCase() === "gold");
      const platinumPlan = plans.find(
        (p) => p.name.toLowerCase() === "platinum"
      );
      const silverPlan = plans.find((p) => p.name.toLowerCase() === "silver");
      setGoldPlanId(goldPlan?.id || null);
      setPlatinumPlanId(platinumPlan?.id || null);
      setSilverPlanId(silverPlan?.id || null);

      // Fetch ALL companies (not filtered by city)
      const { data: companiesData } = await supabase
        .from("companies")
        .select("*")
        .eq("is_active", true);
      setCompanies(companiesData || []);
      setFilteredCompanies(companiesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterCompanies = useCallback(() => {
    let filtered = companies;
    if (searchTerm) {
      filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [companies, searchTerm]);

  useEffect(() => {
    fetchPlansAndCompanies();
  }, [fetchPlansAndCompanies]);

  useEffect(() => {
    filterCompanies();
  }, [filterCompanies]);

  const getTopCompanies = () => {
    const goldCompanies = companies.filter((c) => c.plan_id === goldPlanId);
    const platinumCompanies = companies.filter(
      (c) => c.plan_id === platinumPlanId
    );
    const silverCompanies = companies.filter((c) => c.plan_id === silverPlanId);

    const topCompanies = [];

    // Priority: Gold > Platinum > Silver
    const sortedGold = [...goldCompanies].sort(
      (a, b) => b.rating * b.review_count - a.rating * a.review_count
    );
    const sortedPlatinum = [...platinumCompanies].sort(
      (a, b) => b.rating * b.review_count - a.rating * a.review_count
    );
    const sortedSilver = [...silverCompanies].sort(
      (a, b) => b.rating * b.review_count - a.rating * a.review_count
    );

    // Add up to 3 companies with priority
    topCompanies.push(...sortedGold.slice(0, 3));
    if (topCompanies.length < 3) {
      topCompanies.push(...sortedPlatinum.slice(0, 3 - topCompanies.length));
    }
    if (topCompanies.length < 3) {
      topCompanies.push(...sortedSilver.slice(0, 3 - topCompanies.length));
    }

    return topCompanies.slice(0, 3);
  };

  const getStats = () => {
    const verifiedCount = companies.length;
    const avgRating =
      companies.length > 0
        ? (
            companies.reduce((sum, c) => sum + c.rating, 0) / companies.length
          ).toFixed(1)
        : "0.0";

    return {
      verified: verifiedCount,
      avgRating,
      support: "24/7",
      totalMoves: "10K+",
    };
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);

    try {
      const { error } = await supabase.from("leads").insert({
        name,
        phone,
        email,
        from_location: fromLocation,
        to_location: toLocation,
        moving_date: date ? date.toISOString().slice(0, 10) : null,
        message,
      });
      if (error) throw error;

      toast.success("Request Submitted!", {
        description:
          "Your request has been successfully submitted! We will contact you within 24 hours.",
        duration: 2000,
      });

      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setFromLocation("");
      setToLocation("");
      setDate(undefined);
      setMessage("");
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);
  const startIndex = (currentPage - 1) * companiesPerPage;
  const endIndex = startIndex + companiesPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const stats = getStats();
  const topCompanies = getTopCompanies();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Section 1: Enhanced Header */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
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

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">{cityName}</span>
            </div>

            {/* Main Heading with Animation */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Best Movers & Packers in
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse mt-2">
                  {cityName}
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-6"></div>
            </div>

            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Discover trusted and verified moving companies in {cityName}.
              Compare prices, read authentic reviews, and book your perfect move
              with confidence.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/80 rounded-full mb-3 group-hover:bg-blue-500 transition-colors">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-1">100%</h3>
                <p className="text-blue-100 text-sm">Verified</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600/80 rounded-full mb-3 group-hover:bg-orange-500 transition-colors">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-1">4.8+</h3>
                <p className="text-blue-100 text-sm">Rating</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/80 rounded-full mb-3 group-hover:bg-blue-500 transition-colors">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-1">50K+</h3>
                <p className="text-blue-100 text-sm">Happy Customers</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600/80 rounded-full mb-3 group-hover:bg-orange-500 transition-colors">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-1">24/7</h3>
                <p className="text-blue-100 text-sm">Support</p>
              </div>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Shield className="w-12 h-12 text-orange-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">
                  Licensed & Insured
                </h3>
                <p className="text-blue-100">
                  All movers are fully licensed and insured for your peace of
                  mind
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <DollarSign className="w-12 h-12 text-orange-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                <p className="text-blue-100">
                  Compare quotes instantly and get the best deals in {cityName}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Star className="w-12 h-12 text-orange-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Top Rated</h3>
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

      {/* Section 2: Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.verified}
              </h3>
              <p className="text-gray-600">Verified Companies</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.avgRating}
              </h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.support}
              </h3>
              <p className="text-gray-600">Support</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.totalMoves}
              </h3>
              <p className="text-gray-600">Total Moves</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Top 3 Companies */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Top Rated Movers in {cityName}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our highest-rated and most trusted moving companies in {cityName}
            </p>
          </div>

          {topCompanies.length > 0 ? (
            <div className="space-y-4 max-w-6xl mx-auto">
              {topCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank Badge */}
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-lg shadow-lg">
                          #{index + 1}
                        </div>

                        {/* Company Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                              {company.name}
                            </h3>

                            {/* Plan-based Badges */}
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                ✓ Verified
                              </span>
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                                🕒 24/7 Support
                              </span>
                              {company.plan_id === platinumPlanId && (
                                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  💎 Elite Partner
                                </span>
                              )}
                              {company.plan_id === goldPlanId && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  👑 Premium Pro
                                </span>
                              )}
                              {company.plan_id === silverPlanId && (
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  ⭐ Trusted Choice
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rating and Location */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold text-gray-800">
                                {company.rating.toFixed(1)}
                              </span>
                              <span>({company.review_count} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>
                                {company.city}, {company.state}
                              </span>
                            </div>
                          </div>

                          {/* Company Description */}
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                              {company.description ||
                                "Professional moving services with experienced team members dedicated to providing safe, reliable, and efficient relocation solutions for residential and commercial clients."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex flex-col gap-2 ml-6">
                        <div className="text-right mb-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">{company.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-xs">{company.email}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = "/quote";
                            }}
                          >
                            Get Quote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${company.phone}`;
                            }}
                          >
                            Call Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No companies found in {cityName}</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: All Companies with Search and Pagination */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Companies that Match Your Search
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse all available moving companies in {cityName}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Companies List */}
          <div className="space-y-4 max-w-6xl mx-auto">
            {currentCompanies.length > 0 ? (
              currentCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank Badge */}
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white font-bold text-lg shadow-lg">
                          #{startIndex + index + 1}
                        </div>

                        {/* Company Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                              {company.name}
                            </h3>

                            {/* Plan-based Badges */}
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                ✓ Verified
                              </span>
                              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                                🕒 24/7 Support
                              </span>
                              {company.plan_id === platinumPlanId && (
                                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  💎 Elite Partner
                                </span>
                              )}
                              {company.plan_id === goldPlanId && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  👑 Premium Pro
                                </span>
                              )}
                              {company.plan_id === silverPlanId && (
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  ⭐ Trusted Choice
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rating and Location */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold text-gray-800">
                                {company.rating.toFixed(1)}
                              </span>
                              <span>({company.review_count} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>
                                {company.city}, {company.state}
                              </span>
                            </div>
                          </div>

                          {/* Company Description */}
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                              {company.description ||
                                "Professional moving services with experienced team members dedicated to providing safe, reliable, and efficient relocation solutions for residential and commercial clients."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex flex-col gap-2 ml-6">
                        <div className="text-right mb-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium">{company.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-xs">{company.email}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = "/quote";
                            }}
                          >
                            Get Quote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 px-4 py-2 text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${company.phone}`;
                            }}
                          >
                            Call Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No companies found matching your search.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Help Section */}
      <HelpSection />

      {/* Section 6: Quote Form */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Get Your Moving Quote
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Fill out the form below and receive competitive quotes from our
              top-rated moving companies in {cityName}.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Response</h3>
                <p className="text-sm text-gray-600">
                  Get quotes within 24 hours
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Best Rates</h3>
                <p className="text-sm text-gray-600">
                  Competitive pricing guaranteed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Full Service</h3>
                <p className="text-sm text-gray-600">
                  Packing & moving solutions
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Moving Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input
                        required
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Moving From
                      </label>
                      <Input
                        required
                        placeholder="Current address"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Moving To
                      </label>
                      <Input
                        required
                        placeholder="Destination address"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Moving Date */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Moving Date
                  </h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Additional Information
                  </h3>
                  <Textarea
                    placeholder="Tell us about any special requirements or items that need extra care..."
                    className="min-h-[100px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  disabled={quoteLoading}
                >
                  {quoteLoading ? "Submitting..." : "Get Free Quotes"}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  By submitting this form, you agree to our terms and conditions
                  and privacy policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Company Detail Modal - Reused from CompanyListings */}
      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCompany(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${selectedCompany.name}`}
        >
          <div className="relative w-full max-w-4xl bg-white md:rounded-2xl rounded-lg shadow-2xl overflow-hidden max-h-[85vh]">
            <button
              aria-label="Close"
              className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md text-gray-700 hover:text-gray-900 transition"
              onClick={() => setSelectedCompany(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    {selectedCompany.name}
                  </h3>
                  <div className="flex items-center gap-2 text-blue-100 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {selectedCompany.city}, {selectedCompany.state}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold text-white">
                      {selectedCompany.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-blue-100">
                    {selectedCompany.review_count} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">About</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedCompany.description ||
                        "Reliable movers offering comprehensive relocation services with professional care."}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-semibold text-gray-700 mb-1">
                        Address
                      </h5>
                      <p className="text-gray-600 text-sm break-words">
                        {selectedCompany.address || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-semibold text-gray-700 mb-1">
                        Contact
                      </h5>
                      <p className="text-gray-600 text-sm break-words">
                        {selectedCompany.email}
                      </p>
                      <p className="text-gray-600 text-sm break-words">
                        {selectedCompany.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-semibold text-blue-700 mb-2">
                      Quick Actions
                    </h5>
                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 whitespace-normal break-words"
                        onClick={() =>
                          (window.location.href = `tel:${selectedCompany.phone}`)
                        }
                      >
                        <Phone className="w-4 h-4 mr-2" /> Call{" "}
                        {selectedCompany.name}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 whitespace-normal break-words"
                        onClick={() =>
                          (window.location.href = `mailto:${selectedCompany.email}`)
                        }
                      >
                        <Mail className="w-4 h-4 mr-2" /> Email{" "}
                        {selectedCompany.name}
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedCompany(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
