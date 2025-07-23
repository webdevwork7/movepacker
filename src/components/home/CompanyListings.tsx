
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyCard } from './CompanyCard';
import { Button } from '@/components/ui/button';
import { Company } from '@/types/database';
import { siteConfig } from '@/config/site';
import { Award, TrendingUp, Users, Star } from 'lucide-react';

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
        .order('rating', { ascending: false })
        .limit(siteConfig.maxListings);

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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const topCompanies = companies.slice(0, siteConfig.topListings);
  const popularCompanies = companies.slice(siteConfig.topListings);

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Top Ranked Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Top Ranked Movers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium moving companies that have earned top positions through excellent service and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCompanies.map((company, index) => (
              <CompanyCard
                key={company.id}
                company={company}
                rank={index + 1}
                isTopRanked={true}
              />
            ))}
          </div>
        </div>

        {/* Popular Companies Section */}
        {popularCompanies.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Popular Movers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Trusted moving companies with proven track records and excellent customer reviews.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  isTopRanked={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Move?
            </h3>
            <p className="text-gray-600 mb-6">
              Get instant quotes from multiple movers and choose the best option for your needs.
            </p>
            <Button
              onClick={() => window.location.href = '/quote'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
            >
              Get Free Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
