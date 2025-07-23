
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyCard } from './CompanyCard';
import { Button } from '@/components/ui/button';
import { Company } from '@/types/database';
import { siteConfig } from '@/config/site';
import { Award, TrendingUp, Users, Star, Crown, Fire, Zap } from 'lucide-react';

export const CompanyListings = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const topRankedCompanies = companies.slice(0, 3);
  const premiumCompanies = companies.slice(3, 6);
  const popularCompanies = companies.slice(6, 9);
  const featuredCompanies = companies.slice(9, 12);

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Top Ranked Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              👑 Top Ranked Movers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Premium moving companies that have earned top positions through exceptional service and outstanding customer satisfaction.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRankedCompanies.map((company, index) => (
              <CompanyCard
                key={company.id}
                company={company}
                rank={index + 1}
                isTopRanked={true}
              />
            ))}
          </div>
        </div>

        {/* Premium Movers Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              💎 Premium Movers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Elite moving services offering luxury relocations with white-glove service and premium care for your belongings.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {/* Popular Companies Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6 shadow-lg">
              <Fire className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🔥 Popular Movers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Highly recommended moving companies with proven track records and thousands of satisfied customers.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCompanies.map((company, index) => (
              <CompanyCard
                key={company.id}
                company={company}
                rank={index + 7}
                isTopRanked={false}
              />
            ))}
          </div>
        </div>

        {/* Featured Companies Section */}
        {featuredCompanies.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                ⚡ Featured Movers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Specially selected moving companies offering exceptional value and reliable service for all your moving needs.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Make Your Move?
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Get instant quotes from multiple top-rated movers and choose the perfect option for your needs. It's free, fast, and easy!
            </p>
            <Button
              onClick={() => window.location.href = '/quote'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Free Quote Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
