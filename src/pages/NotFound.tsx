import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Truck } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="container px-4 py-16 text-center">
        <div className="relative mx-auto w-48 h-48 mb-8">
          {/* Animated truck */}
          <div className="absolute inset-0 animate-bounce-slow">
            <Truck className="w-full h-full text-blue-600" />
          </div>
          {/* 404 text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-8xl font-bold text-gray-200">404</h1>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Oops! We've Lost Our Way
        </h2>
        <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
          Just like a moving truck taking a wrong turn, this page seems to have
          gotten lost. Let's get you back on the right path!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="text-lg px-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-32 h-32 -translate-y-1/2">
          <div className="w-full h-full bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        </div>
        <div className="absolute top-1/4 right-0 w-24 h-24">
          <div className="w-full h-full bg-orange-100 rounded-full opacity-20 animate-pulse delay-300"></div>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
