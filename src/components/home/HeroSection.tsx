
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Truck } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const HeroSection = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      // Navigate to quote page with pre-filled data
      window.location.href = `/quote?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}`;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Moving Made
            <span className="text-orange-400"> Easy</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with trusted movers and packers nationwide. Get instant quotes and book your move today.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="From Location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="pl-10 h-12 text-gray-800"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="To Location"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="pl-10 h-12 text-gray-800"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Movers
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">500+</h3>
              <p className="text-blue-100">Verified Movers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">10,000+</h3>
              <p className="text-blue-100">Successful Moves</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">24/7</h3>
              <p className="text-blue-100">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
