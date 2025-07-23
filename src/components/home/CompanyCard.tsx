
import { Star, Phone, Mail, MapPin, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/types/database';

interface CompanyCardProps {
  company: Company;
  rank?: number;
  isTopRanked?: boolean;
}

export const CompanyCard = ({ company, rank, isTopRanked }: CompanyCardProps) => {
  const handleCall = () => {
    window.location.href = `tel:${company.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${company.email}`;
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
      isTopRanked ? 'border-2 border-orange-400 shadow-lg' : 'border border-gray-200'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-800 truncate">
                {company.name}
              </h3>
              {rank && (
                <Badge variant={isTopRanked ? 'default' : 'secondary'}>
                  #{rank}
                </Badge>
              )}
              {isTopRanked && (
                <Award className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {renderStars(company.rating)}
              <span className="text-sm text-gray-600 ml-1">
                {company.rating.toFixed(1)} ({company.review_count} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{company.city}, {company.state}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 mb-4 line-clamp-2">
          {company.description || 'Professional moving and packing services with years of experience.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleCall}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
          <Button
            onClick={handleEmail}
            variant="outline"
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
