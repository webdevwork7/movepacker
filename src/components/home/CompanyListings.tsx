import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CompanyCard } from "./CompanyCard";
import { Button } from "@/components/ui/button";
import { Company } from "@/types/database";
import { siteConfig } from "@/config/site";
import {
  Award,
  TrendingUp,
  Users,
  Star,
  Crown,
  Flame,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  X,
  Shield,
  Clock,
  ThumbsUp,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
}

export const CompanyListings = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [goldPlanId, setGoldPlanId] = useState<string | null>(null);
  const [platinumPlanId, setPlatinumPlanId] = useState<string | null>(null); // Added
  const [silverPlanId, setSilverPlanId] = useState<string | null>(null); // Added
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  useEffect(() => {
    fetchPlansAndCompanies();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCompany(null);
    };
    if (selectedCompany) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedCompany]);

  // Reset visible count when company list updates
  useEffect(() => {
    setVisibleCount(10);
  }, [companies]);

  const fetchPlansAndCompanies = async () => {
    setLoading(true);
    // Fetch plans
    const { data: plansRaw } = await supabase.from("plans").select("id, name");
    const plans: Plan[] = Array.isArray(plansRaw) ? (plansRaw as Plan[]) : [];
    const goldPlan = plans.find((p) => p.name.toLowerCase() === "gold");
    const platinumPlan = plans.find((p) => p.name.toLowerCase() === "platinum");
    const silverPlan = plans.find((p) => p.name.toLowerCase() === "silver");
    setGoldPlanId(goldPlan?.id || null);
    setPlatinumPlanId(platinumPlan?.id || null);
    setSilverPlanId(silverPlan?.id || null);
    // Fetch companies
    const { data: companiesData } = await supabase
      .from("companies")
      .select("*")
      .eq("is_active", true);
    setCompanies(companiesData || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Helper to avoid duplicate companies in sections
  const usedCompanyIds = new Set<string>();
  const getAndMark = (arr: Company[], count: number) => {
    const result: Company[] = [];
    for (const c of arr) {
      if (!usedCompanyIds.has(c.id) && result.length < count) {
        usedCompanyIds.add(c.id);
        result.push(c);
      }
    }
    return result;
  };

  // Top Ranked: Only companies with Gold plan, sorted by review_count
  const goldCompanies = companies.filter((c) => c.plan_id === goldPlanId);
  const topRankedCompanies = getAndMark(
    [...goldCompanies].sort((a, b) => b.review_count - a.review_count),
    3
  );

  // Popular: Top 3 by review_count (highest), regardless of duplicates with other sections
  const popularCompanies = [...companies]
    .sort((a, b) => b.review_count - a.review_count)
    .slice(0, 3);

  // Premium: Only companies with Platinum plan, top 3 by rating * review_count, not already shown
  const platinumCompanies = companies.filter(
    (c) => c.plan_id === platinumPlanId
  );
  const premiumSorted = [...platinumCompanies].sort(
    (a, b) => b.rating * b.review_count - a.rating * a.review_count
  );
  const premiumCompanies = getAndMark(premiumSorted, 3);

  // Featured: Only companies with Silver plan, 3 random, not already shown
  const silverCompanies = companies.filter(
    (c) => c.plan_id === silverPlanId && !usedCompanyIds.has(c.id)
  );
  const featuredCompanies = silverCompanies
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // Function to get rank badge styles
  const getRankBadgeStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          containerClass:
            "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500",
          wrapperClass: "scale-110 shadow-xl shadow-yellow-200/50 z-20",
          icon: "👑",
          label: "1st Place Champion",
          ribbon: "bg-gradient-to-r from-yellow-500 to-amber-500",
        };
      case 2:
        return {
          containerClass:
            "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500",
          wrapperClass: "scale-105 shadow-lg shadow-gray-200/50 z-10",
          icon: "🥈",
          label: "2nd Place Elite",
          ribbon: "bg-gradient-to-r from-gray-400 to-gray-600",
        };
      case 3:
        return {
          containerClass:
            "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800",
          wrapperClass: "scale-100 shadow-md shadow-amber-200/50",
          icon: "🥉",
          label: "3rd Place Premium",
          ribbon: "bg-gradient-to-r from-amber-700 to-amber-800",
        };
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Initial Companies Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Trusted Moving Companies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover reliable and professional moving services in your area.
              Each company is verified and rated by real customers.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4"></div>
          </div>

          <div className="space-y-4 max-w-6xl mx-auto">
            {companies.length > 0 ? (
              companies.slice(0, visibleCount).map((company, index) => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start md:items-center space-x-3 md:space-x-4 flex-1">
                        {/* Rank Badge */}
                        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white font-bold text-sm md:text-lg shadow-lg flex-shrink-0">
                          #{index + 1}
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors truncate">
                              {company.name}
                            </h3>

                            {/* Plan-based Badges */}
                            <div className="flex flex-wrap items-center gap-1 md:gap-2">
                              <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                ✓ Verified
                              </span>
                              <span className="px-2 md:px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
                                🕒 24/7
                              </span>
                              {company.plan_id === platinumPlanId && (
                                <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  💎 Elite
                                </span>
                              )}
                              {company.plan_id === goldPlanId && (
                                <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  👑 Premium
                                </span>
                              )}
                              {company.plan_id === silverPlanId && (
                                <span className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-md">
                                  ⭐ Trusted
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rating and Location */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold text-gray-800">
                                {company.rating.toFixed(1)}
                              </span>
                              <span>({company.review_count} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="truncate">
                                {company.city}, {company.state}
                              </span>
                            </div>
                          </div>

                          {/* Company Description */}
                          <div className="hidden md:block">
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                              {company.description ||
                                "Professional moving services with experienced team members dedicated to providing safe, reliable, and efficient relocation solutions for residential and commercial clients."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex flex-col gap-3 lg:ml-6 lg:flex-shrink-0">
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="font-medium truncate">
                              {company.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="text-xs truncate">
                              {company.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 text-sm font-medium flex-1 sm:flex-none"
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
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 px-3 md:px-4 py-2 text-sm font-medium flex-1 sm:flex-none"
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
                <div className="inline-block bg-white/70 backdrop-blur rounded-xl px-6 py-4 shadow-sm">
                  <p className="text-gray-700 text-lg font-medium">
                    No companies available at the moment.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Please check back soon.
                  </p>
                </div>
              </div>
            )}
          </div>

          {companies.length > visibleCount && (
            <div className="mt-10 flex justify-center">
              <Button
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + 10, companies.length)
                  )
                }
                className="px-8"
              >
                Load more
              </Button>
            </div>
          )}
        </div>

        {/* Top Ranked Section - 👑 Top Ranked Movers section commented out */}
        {/*
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-orange-100 opacity-50 rounded-3xl"></div>
          <div className="relative px-6 py-16 rounded-3xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                👑 Top Ranked Movers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Premium moving companies that have earned top positions through
                exceptional service and outstanding customer satisfaction.
              </p>
              <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-6 rounded-full shadow-sm"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {topRankedCompanies.length > 0 ? (
                topRankedCompanies.map((company, index) => {
                  const rankStyle = getRankBadgeStyles(index + 1);
                  return (
                    <div
                      key={company.id}
                      className={`relative ${rankStyle?.wrapperClass} transition-all duration-300`}
                    >
                      <div
                        className={`absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 ${rankStyle?.containerClass} text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap`}
                      >
                        <span className="text-2xl">{rankStyle?.icon}</span>
                        <span className="font-bold">{rankStyle?.label}</span>
                      </div>

                      <div className="absolute -left-2 top-12 h-8">
                        <div
                          className={`${rankStyle?.ribbon} text-white px-4 py-1 shadow-md relative`}
                        >
                          <div className="absolute left-0 -bottom-2 border-l-[8px] border-t-[8px] border-t-transparent"></div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-lg"></div>
                        <CompanyCard
                          company={company}
                          rank={index + 1}
                          isTopRanked={true}
                          onClick={() => setSelectedCompany(company)}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-3 text-center py-12">
                  <div className="inline-block bg-white/70 backdrop-blur rounded-xl px-6 py-4 shadow-sm">
                    <p className="text-gray-700 text-lg font-medium">
                      No companies available at the moment.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Please check back soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        */}

        {/* Premium Movers Section - 💎 Premium Movers section commented out */}
        {/*
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-50 rounded-3xl"></div>
          <div className="relative px-6 py-12 rounded-3xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                💎 Premium Movers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Elite moving services offering luxury relocations with
                white-glove service and premium care for your belongings.
              </p>
              <div className="w-32 h-2 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full shadow-sm"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {premiumCompanies.length > 0 ? (
                premiumCompanies.map((company, index) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    rank={index + 4}
                    isTopRanked={false}
                    onClick={() => setSelectedCompany(company)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="inline-block bg-white/70 backdrop-blur rounded-xl px-6 py-4 shadow-sm">
                    <p className="text-gray-700 text-lg font-medium">
                      No companies available at the moment.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Please check back soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        */}

        {/* Popular Companies Section - 🔥 Popular Movers section commented out */}
        {/*
        <div className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 opacity-50 rounded-3xl"></div>
          <div className="relative px-6 py-12 rounded-3xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Flame className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                🔥 Popular Movers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Highly recommended moving companies with proven track records
                and thousands of satisfied customers.
              </p>
              <div className="w-32 h-2 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-6 rounded-full shadow-sm"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularCompanies.length > 0 ? (
                popularCompanies.map((company, index) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    rank={index + 7}
                    isTopRanked={false}
                    onClick={() => setSelectedCompany(company)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="inline-block bg-white/70 backdrop-blur rounded-xl px-6 py-4 shadow-sm">
                    <p className="text-gray-700 text-lg font-medium">
                      No companies available at the moment.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Please check back soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        */}

        {/* Featured Companies Section */}
        {featuredCompanies.length > 0 && (
          <div className="mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 opacity-50 rounded-3xl"></div>
            <div className="relative px-6 py-12 rounded-3xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                  ⚡ Featured Movers
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Specially selected moving companies offering exceptional value
                  and reliable service for all your moving needs.
                </p>
                <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-6 rounded-full shadow-sm"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredCompanies.map((company, index) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    rank={index + 10}
                    isTopRanked={false}
                    onClick={() => setSelectedCompany(company)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action - Ready to Make Your Move? section commented out */}
        {/*
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-16 shadow-2xl max-w-4xl mx-auto text-white transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 animate-shimmer"></div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-10 rounded-full mb-8 backdrop-blur-sm">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-5xl font-bold mb-6 text-white">
                Ready to Make Your Move?
              </h3>
              <p className="text-blue-100 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                Get instant quotes from multiple top-rated movers and choose the
                perfect option for your needs. It's free, fast, and easy!
              </p>
              <Button
                onClick={() => (window.location.href = "/quote")}
                className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                Get Free Quote Now
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
        */}
      </div>

      {/* Company Detail Modal */}
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
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/15 backdrop-blur">
                  <span className="inline-flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Verified
                  </span>
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/15 backdrop-blur">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 24/7 Support
                  </span>
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/15 backdrop-blur">
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> Trusted
                  </span>
                </span>
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
