import { useState } from "react";
import { LeadList } from "@/components/company/LeadList";

export const CompanyDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Company Dashboard
      </h1>
      <LeadList />
    </div>
  );
};
