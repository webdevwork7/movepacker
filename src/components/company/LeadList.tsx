import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BidForm } from "./BidForm";
import { Lead, Company } from "@/types/database";
import { useAuth } from "@/hooks/useAuth";

export const LeadList = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
    fetchCompanyId();
  }, [user]);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data);
  };

  const fetchCompanyId = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!error && data) setCompanyId(data.id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Available Leads</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <Card key={lead.id} className="relative">
            <CardContent className="p-6">
              <div className="mb-2">
                <span className="font-bold text-lg">{lead.name}</span>
                <span className="ml-2 text-gray-500 text-sm">{lead.email}</span>
              </div>
              <div className="text-gray-600 mb-2">
                <span>From: {lead.from_location}</span> <br />
                <span>To: {lead.to_location}</span>
              </div>
              <div className="text-gray-600 mb-2">
                <span>Phone: {lead.phone}</span>
              </div>
              <div className="text-gray-500 text-sm mb-2">{lead.message}</div>
              <Button
                onClick={() => {
                  setSelectedLead(lead);
                  setShowBidForm(true);
                }}
                className="w-full mt-2"
                disabled={!companyId}
              >
                Place Bid
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {showBidForm && selectedLead && companyId && (
        <BidForm
          lead={selectedLead}
          companyId={companyId}
          onClose={() => setShowBidForm(false)}
        />
      )}
    </div>
  );
};
