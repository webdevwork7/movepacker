import {
  Star,
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Company } from "@/types/database";

interface CompanyCardProps {
  company: Company;
  rank?: number;
  isTopRanked?: boolean;
}

export const CompanyCard = ({
  company,
  rank,
  isTopRanked,
}: CompanyCardProps) => {
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
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card
      className={`h-full transition-all duration-300 hover:shadow-xl ${
        isTopRanked
          ? "border-2 border-orange-400 shadow-lg"
          : "border border-gray-200"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
              {company.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {renderStars(company.rating)}
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {company.rating.toFixed(1)} ({company.review_count} reviews)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                {company.city}, {company.state}
              </span>
            </div>
          </div>

          <div className="flex-grow">
            <p className="text-gray-600 mb-4 line-clamp-2">
              {company.description ||
                "Professional moving and packing services with years of experience."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
            <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-500 mb-1" />
              <span className="text-gray-600 text-xs">Verified</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-gray-600 text-xs">24/7</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-purple-500 mb-1" />
              <span className="text-gray-600 text-xs">Trusted</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <Button
              onClick={handleCall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            <Button onClick={handleEmail} variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
