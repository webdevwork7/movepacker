import { DollarSign, TrendingUp, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const BidSection = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Make Your Bid Today
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join our platform and compete for top positions. Get more visibility
            and attract more customers.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <Card className="transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Standard Listing</h3>
                <p className="text-gray-600">
                  Get started with basic visibility
                </p>
                <div className="text-3xl font-bold text-gray-800 mt-4">
                  $99<span className="text-lg text-gray-600">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Standard listing position
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Basic company profile
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Email support
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Place Bid
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="transform hover:scale-105 transition-all duration-300 border-2 border-blue-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Premium Position</h3>
                <p className="text-gray-600">Enhanced visibility & features</p>
                <div className="text-3xl font-bold text-gray-800 mt-4">
                  $199<span className="text-lg text-gray-600">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Top 3 listing position
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Featured company profile
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Priority support
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Analytics dashboard
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Place Premium Bid
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Featured Plan */}
          <Card className="transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Featured Listing</h3>
                <p className="text-gray-600">Maximum exposure & benefits</p>
                <div className="text-3xl font-bold text-gray-800 mt-4">
                  $149<span className="text-lg text-gray-600">/mo</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Featured section placement
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Enhanced company profile
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                    ✓
                  </span>
                  Priority email support
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Place Featured Bid
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
