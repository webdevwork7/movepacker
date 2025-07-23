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
} from "lucide-react";

export const CompanyListings = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
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

  // First 10 companies shown at the top
  const initialCompanies = companies.slice(0, 10);
  // Rest of the companies for different sections
  const remainingCompanies = companies.slice(10);
  const topRankedCompanies = remainingCompanies.slice(0, 3);
  const premiumCompanies = remainingCompanies.slice(3, 6);
  const popularCompanies = remainingCompanies.slice(6, 9);
  const featuredCompanies = remainingCompanies.slice(9, 12);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {initialCompanies.map((company, index) => (
              <CompanyCard
                key={company.id}
                company={company}
                rank={index + 1}
                isTopRanked={false}
              />
            ))}
          </div>
        </div>

        {/* Top Ranked Section */}
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
              {topRankedCompanies.map((company, index) => {
                const rankStyle = getRankBadgeStyles(index + 1);
                return (
                  <div
                    key={company.id}
                    className={`relative ${rankStyle?.wrapperClass} transition-all duration-300`}
                  >
                    {/* Rank Badge */}
                    <div
                      className={`absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 ${rankStyle?.containerClass} text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap`}
                    >
                      <span className="text-2xl">{rankStyle?.icon}</span>
                      <span className="font-bold">{rankStyle?.label}</span>
                    </div>

                    {/* Ribbon */}
                    <div className="absolute -left-2 top-12 h-8">
                      <div
                        className={`${rankStyle?.ribbon} text-white px-4 py-1 shadow-md relative`}
                      >
                        <div className="absolute left-0 -bottom-2 border-l-[8px] border-t-[8px] border-t-transparent"></div>
                      </div>
                    </div>

                    {/* Card */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-lg"></div>
                      <CompanyCard
                        company={company}
                        rank={index + 1}
                        isTopRanked={true}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium Movers Section */}
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
              {premiumCompanies.map((company, index) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  rank={index + 4}
                  isTopRanked={false}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Popular Companies Section */}
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
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No popular movers available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

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
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-16 shadow-2xl max-w-4xl mx-auto text-white transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 transform -skew-x-12 animate-shimmer"></div>
            </div>
            {/* Content */}
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
      </div>
    </div>
  );
};
