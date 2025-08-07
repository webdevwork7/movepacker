import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const Quote = () => {
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState<Date>();
  const [fromLocation, setFromLocation] = useState(
    searchParams.get("from") || ""
  );
  const [toLocation, setToLocation] = useState(searchParams.get("to") || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get Your Moving Quote
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill out the form below and receive competitive quotes from our
            top-rated moving companies.
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Moving Details
                </h2>
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
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location Information
                </h2>
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
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Moving Date
                </h2>
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
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Additional Information
                </h2>
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
                disabled={loading}
              >
                {loading ? "Submitting..." : "Get Free Quotes"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                By submitting this form, you agree to our terms and conditions
                and privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
