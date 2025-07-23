import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Bid } from "@/types/database";
import { useAuth } from "@/hooks/useAuth";

export const MyBids = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchCompanyId();
  }, [user]);

  useEffect(() => {
    if (companyId) fetchBids();
  }, [companyId]);

  const fetchCompanyId = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!error && data) setCompanyId(data.id);
  };

  const fetchBids = async () => {
    if (!companyId) return;
    const { data, error } = await supabase
      .from("bids")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    if (!error && data) setBids(data as Bid[]);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Bids</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bids.map((bid) => (
          <Card key={bid.id} className="relative">
            <CardContent className="p-6">
              <div className="mb-2">
                <span className="font-bold text-lg">
                  Bid Amount: ₹{bid.amount}
                </span>
              </div>
              <div className="text-gray-600 mb-2">
                Status:{" "}
                <span className="font-semibold capitalize">{bid.status}</span>
              </div>
              {bid.message && (
                <div className="text-gray-500 text-sm mb-2">{bid.message}</div>
              )}
              <div className="text-gray-400 text-xs">
                Placed on: {new Date(bid.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
