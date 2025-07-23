import { useState } from "react";
import { LeadList } from "@/components/company/LeadList";
import { MyBids } from "@/components/company/MyBids";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const CompanyDashboard = () => {
  const [tab, setTab] = useState("leads");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Company Dashboard
      </h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="leads">Available Leads</TabsTrigger>
          <TabsTrigger value="bids">My Bids</TabsTrigger>
        </TabsList>
        <TabsContent value="leads">
          <LeadList />
        </TabsContent>
        <TabsContent value="bids">
          <MyBids />
        </TabsContent>
      </Tabs>
    </div>
  );
};
