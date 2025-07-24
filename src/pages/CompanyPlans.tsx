import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Gem, Crown, Star } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string;
  priority: number;
  price: number;
  features: string[];
}

export const CompanyPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("priority", { ascending: true });
    if (!error && data) setPlans(data);
    setLoading(false);
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) return;
    setSelecting(planId);
    // Get company by user_id
    const { data: company, error } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!error && company) {
      await supabase
        .from("companies")
        .update({ plan_id: planId })
        .eq("id", company.id);
      navigate("/company");
    }
    setSelecting(null);
  };

  if (loading) return <div className="text-center py-16">Loading plans...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-16 px-4 relative overflow-hidden">
      {/* Decorative floating shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-yellow-200 via-yellow-100 to-transparent rounded-full blur-2xl opacity-40 -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-200 via-blue-100 to-transparent rounded-full blur-2xl opacity-30 -z-10 animate-pulse" />
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight drop-shadow-lg">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select the plan that best fits your company. Upgrade anytime for
            more features and visibility!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {plans.map((plan) => {
            // Plan-specific styles
            let cardClass = "";
            let icon = null;
            const badge = null;
            let priceClass = "";
            let bgClass = "";
            let btnClass = "";
            let badgeTab = null;
            if (plan.name.toLowerCase() === "gold") {
              cardClass =
                "border-yellow-400 shadow-2xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 animate-gold-glow";
              icon = (
                <Crown className="w-12 h-12 text-yellow-500 drop-shadow-lg" />
              );
              badgeTab = (
                <div className="absolute left-1/2 -top-7 -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="bg-yellow-400 text-white px-8 py-2 rounded-t-2xl rounded-b-md font-bold shadow-lg text-base tracking-wide border-2 border-yellow-300 min-w-[120px] text-center drop-shadow-lg">
                      Most Popular
                    </div>
                    <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-8 h-2 bg-yellow-200 rounded-b-full shadow-md" />
                  </div>
                </div>
              );
              priceClass = "text-yellow-500";
              bgClass =
                "bg-gradient-to-br from-yellow-100 via-white to-yellow-50";
              btnClass =
                "bg-yellow-400 hover:bg-yellow-500 text-white shadow-lg";
            } else if (plan.name.toLowerCase() === "platinum") {
              cardClass =
                "border-gray-400 shadow-xl bg-gradient-to-br from-gray-50 via-white to-gray-200 animate-platinum-glow";
              icon = <Gem className="w-12 h-12 text-gray-400 drop-shadow-lg" />;
              badgeTab = (
                <div className="absolute left-1/2 -top-7 -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-8 py-2 rounded-t-2xl rounded-b-md font-bold shadow text-base tracking-wide border-2 border-gray-300 min-w-[120px] text-center">
                      Premium
                    </div>
                    <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-8 h-2 bg-gray-200 rounded-b-full shadow-md" />
                  </div>
                </div>
              );
              priceClass = "text-gray-700";
              bgClass = "bg-gradient-to-br from-gray-100 via-white to-gray-50";
              btnClass = "bg-gray-600 hover:bg-gray-700 text-white shadow";
            } else {
              cardClass =
                "border-blue-300 shadow bg-gradient-to-br from-blue-50 via-white to-blue-100 animate-silver-glow";
              icon = (
                <Star className="w-12 h-12 text-blue-400 drop-shadow-lg" />
              );
              badgeTab = (
                <div className="absolute left-1/2 -top-7 -translate-x-1/2 z-20">
                  <div className="relative">
                    <div className="bg-blue-400 text-white px-8 py-2 rounded-t-2xl rounded-b-md font-bold shadow text-base tracking-wide border-2 border-blue-300 min-w-[120px] text-center">
                      Classic
                    </div>
                    <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-8 h-2 bg-blue-200 rounded-b-full shadow-md" />
                  </div>
                </div>
              );
              priceClass = "text-blue-600";
              bgClass = "bg-gradient-to-br from-blue-100 via-white to-blue-50";
              btnClass = "bg-blue-500 hover:bg-blue-600 text-white shadow";
            }
            return (
              <Card
                key={plan.id}
                className={`relative border-2 rounded-3xl overflow-visible transition-transform duration-300 hover:scale-105 ${cardClass} ${bgClass} shadow-xl hover:shadow-2xl`} // overflow-visible for badge
                style={{ minHeight: 500, paddingTop: 32 }} // extra top padding for badge
              >
                {badgeTab}
                <CardContent className="p-10 flex flex-col items-center relative pt-8">
                  {icon && <div className="mb-4 mt-2">{icon}</div>}
                  <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-tight drop-shadow">
                    {plan.name}
                  </h2>
                  <div
                    className={`text-5xl font-black mb-2 ${priceClass} drop-shadow-lg`}
                  >
                    ${plan.price}
                  </div>
                  <p className="text-gray-600 mb-6 text-center text-lg font-medium">
                    {plan.description}
                  </p>
                  <ul className="mb-8 space-y-3 w-full">
                    {plan.features &&
                      plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-gray-700 text-base font-semibold"
                        >
                          <span
                            className={`inline-flex w-6 h-6 items-center justify-center rounded-full ${
                              plan.name.toLowerCase() === "gold"
                                ? "bg-yellow-200 text-yellow-600"
                                : plan.name.toLowerCase() === "platinum"
                                ? "bg-gray-200 text-gray-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <Star className="w-4 h-4" />
                          </span>
                          {feature}
                        </li>
                      ))}
                  </ul>
                  <Button
                    className={`w-full py-3 text-lg font-bold rounded-xl transition-all duration-200 ${btnClass} ${
                      selecting === plan.id
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={selecting === plan.id}
                  >
                    {selecting === plan.id
                      ? "Selecting..."
                      : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
