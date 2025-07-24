import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BidForm } from "./BidForm";
import { Lead, Company } from "@/types/database";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export const LeadList = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [planName, setPlanName] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const leadsPerPage = 10;
  const { user } = useAuth();

  useEffect(() => {
    fetchLeads();
    fetchCompanyAndPlan();
  }, [user]);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLeads(data);
  };

  const fetchCompanyAndPlan = async () => {
    if (!user) return;
    // Fetch company with plan relation (fix join syntax)
    const { data, error } = await supabase
      .from("companies")
      .select("*, plans:plan_id(name)")
      .eq("user_id", user.id)
      .single();
    if (!error && data) {
      console.log(data);
      setCompany(data as Company);
      setPlanName(data.plans?.name?.toLowerCase() || "");
    }
  };

  // Plan logic
  let visibleLeads = leads;

  if (planName === "gold") {
    visibleLeads = leads;
  } else if (planName === "platinum") {
    visibleLeads = leads.slice(0, Math.ceil(leads.length * 0.6));
  } else if (planName === "silver") {
    visibleLeads = leads.slice(0, Math.ceil(leads.length * 0.3));
  }

  // If company has no plan, show upsell and return early
  if (company && !company.plan_id) {
    return (
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-100 via-white to-blue-50 border-2 border-blue-300 shadow flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-200 text-blue-600 text-3xl font-bold shadow-lg">
            💼
          </span>
          <div>
            <div className="text-xl font-bold text-blue-700 mb-1">
              Get Started: Choose a Plan
            </div>
            <div className="text-gray-700">
              To access and manage leads, please select a plan that fits your
              business needs. Unlock more features and opportunities by
              upgrading your plan!
            </div>
          </div>
        </div>
        <a
          href="/company-plans"
          className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg transition-all duration-200"
        >
          Choose a Plan
        </a>
      </div>
    );
  }

  // Plan info section
  let planInfoSection = null;

  if (planName === "gold") {
    planInfoSection = (
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-yellow-100 via-white to-yellow-50 border-2 border-yellow-400 shadow flex items-center gap-6">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-200 text-yellow-600 text-4xl font-bold shadow-lg">
          👑
        </span>
        <div>
          <div className="text-2xl font-bold text-yellow-700 mb-1">
            Gold Plan Activated
          </div>
          <div className="text-gray-700">
            You have full access to all available leads and premium dashboard
            features. Thank you for being a top-tier partner!
          </div>
        </div>
      </div>
    );
  } else if (planName === "platinum") {
    planInfoSection = (
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-gray-100 via-white to-gray-50 border-2 border-gray-400 shadow flex items-center gap-6">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-600 text-4xl font-bold shadow-lg">
          💎
        </span>
        <div>
          <div className="text-2xl font-bold text-gray-700 mb-1">
            Platinum Plan Activated
          </div>
          <div className="text-gray-700">
            You can view 60% of available leads and enjoy advanced features.
            Upgrade to Gold for full access!
          </div>
        </div>
      </div>
    );
  } else if (planName === "silver") {
    planInfoSection = (
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-100 via-white to-blue-50 border-2 border-blue-300 shadow flex items-center gap-6">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-200 text-blue-600 text-4xl font-bold shadow-lg">
          ⭐
        </span>
        <div>
          <div className="text-2xl font-bold text-blue-700 mb-1">
            Silver Plan Activated
          </div>
          <div className="text-gray-700">
            You can view 30% of available leads. Upgrade to Gold for full access
            and premium features!
          </div>
        </div>
      </div>
    );
  }

  // Filter and search logic
  const filteredLeads = visibleLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.toLowerCase().includes(search.toLowerCase()) ||
      lead.from_location.toLowerCase().includes(search.toLowerCase()) ||
      lead.to_location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? lead.from_location === filter : true;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (page - 1) * leadsPerPage,
    page * leadsPerPage
  );

  // Unique locations for filter dropdown
  const uniqueLocations = Array.from(
    new Set(leads.map((lead) => lead.from_location))
  );

  return (
    <div>
      {/* Plan info section always at the top */}
      {planInfoSection}
      {/* Dashboard content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center w-full md:w-1/2">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search by name, email, phone, or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-200"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="min-w-[140px] border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">
            Showing {paginatedLeads.length} of {filteredLeads.length} leads
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedLeads.map((lead) => (
          <Card
            key={lead.id}
            className="relative border-2 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 hover:shadow-2xl transition-all duration-300"
          >
            <CardContent className="p-7 flex flex-col gap-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-xl shadow">
                  {lead.name[0]}
                </span>
                <div>
                  <div className="font-bold text-lg text-gray-800">
                    {lead.name}
                  </div>
                  <div className="text-gray-500 text-sm">{lead.email}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-sm mb-2">
                <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-semibold">
                  From: {lead.from_location}
                </span>
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                  To: {lead.to_location}
                </span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                  {lead.moving_date ? `Date: ${lead.moving_date}` : "No Date"}
                </span>
              </div>
              <div className="text-gray-600 mb-1">
                <span className="font-semibold">Phone:</span> {lead.phone}
              </div>
              {lead.message && (
                <div className="text-gray-500 text-sm mb-2 italic border-l-4 border-blue-200 pl-3">
                  {lead.message}
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <a
                  href={`tel:${lead.phone}`}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow text-center transition-all duration-200"
                >
                  Call Now
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow text-center transition-all duration-200"
                >
                  Email
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="mx-2 text-gray-700 font-semibold">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
      {showBidForm && selectedLead && company && (
        <BidForm
          lead={selectedLead}
          companyId={company.id}
          onClose={() => setShowBidForm(false)}
        />
      )}
      {/* Gold plan upsell for platinum/silver at the very bottom */}
      {(planName === "platinum" || planName === "silver") && (
        <div className="mt-12 mb-4 p-6 rounded-2xl bg-gradient-to-r from-yellow-100 via-white to-yellow-50 border-2 border-yellow-300 shadow flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-200 text-yellow-600 text-3xl font-bold shadow-lg">
              🥇
            </span>
            <div>
              <div className="text-xl font-bold text-yellow-700 mb-1">
                Unlock All Leads with Gold Plan
              </div>
              <div className="text-gray-700">
                Upgrade to Gold to access 100% of available leads and maximize
                your business opportunities!
              </div>
            </div>
          </div>
          <a
            href="/company-plans"
            className="mt-4 md:mt-0 bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-lg transition-all duration-200"
          >
            Upgrade to Gold
          </a>
        </div>
      )}
    </div>
  );
};
