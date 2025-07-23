import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Company, Lead, Bid, AdminSettings } from "@/types/database";
import {
  Settings,
  Users,
  FileText,
  DollarSign,
  Eye,
  Check,
  X,
  LogOut,
  TrendingUp,
  Mail,
  Phone,
  Search,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartComponent } from "@/components/ui/chart";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type DataType = "companies" | "leads" | "bids";
type SortOrder = "asc" | "desc";

export const Admin = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [settings, setSettings] = useState<AdminSettings>({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchData();
  }, [user, isAdmin]);

  const fetchData = async () => {
    try {
      // Fetch companies
      const { data: companiesData } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch leads
      const { data: leadsData } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      // Fetch bids
      const { data: bidsData } = await supabase
        .from("bids")
        .select("*, companies(name)")
        .order("created_at", { ascending: false });

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("settings")
        .select("*");

      setCompanies(companiesData || []);
      setLeads(leadsData || []);
      setBids(
        bidsData?.map((bid) => ({
          ...bid,
          status: bid.status as "pending" | "approved" | "rejected",
        })) || []
      );

      const settingsObj: AdminSettings = {};
      settingsData?.forEach((setting) => {
        settingsObj[setting.key as keyof AdminSettings] = setting.value;
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApproveCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({ is_active: true })
        .eq("id", companyId);

      if (error) throw error;

      toast({
        title: "Company Approved",
        description: "Company has been activated successfully.",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve company",
        variant: "destructive",
      });
    }
  };

  const handleRejectCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({ is_active: false })
        .eq("id", companyId);

      if (error) throw error;

      toast({
        title: "Company Rejected",
        description: "Company has been deactivated.",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject company",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getFilteredData = <T extends Company | Lead | Bid>(
    data: T[],
    type: DataType
  ): T[] => {
    let filtered = [...data];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        switch (type) {
          case "companies":
            return (
              (item as Company).name.toLowerCase().includes(searchLower) ||
              (item as Company).email.toLowerCase().includes(searchLower)
            );
          case "leads":
            return (
              (item as Lead).name.toLowerCase().includes(searchLower) ||
              (item as Lead).email.toLowerCase().includes(searchLower)
            );
          case "bids":
            return (item as Bid).companies?.name
              .toLowerCase()
              .includes(searchLower);
          default:
            return true;
        }
      });
    }

    // Apply filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => {
        switch (type) {
          case "companies":
            return filterStatus === "active"
              ? (item as Company).is_active
              : !(item as Company).is_active;
          case "bids":
            return (item as Bid).status === filterStatus;
          default:
            return true;
        }
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  };

  const getFilteredAndPaginatedData = <T extends Company | Lead | Bid>(
    data: T[],
    type: DataType
  ): { items: T[]; totalPages: number } => {
    const filtered = getFilteredData(data, type);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const items = filtered.slice(startIndex, startIndex + itemsPerPage);
    return { items, totalPages };
  };

  const renderPagination = (totalPages: number) => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Show first page, last page, current page, and pages around current
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            // Show ellipsis for gaps
            if (page === 2 || page === totalPages - 1) {
              return (
                <PaginationItem key={page}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderDashboardCharts = () => {
    const companyStats = {
      labels: ["Active", "Inactive"],
      datasets: [
        {
          data: [
            companies.filter((c) => c.is_active).length,
            companies.filter((c) => !c.is_active).length,
          ],
          backgroundColor: ["#22c55e", "#ef4444"],
        },
      ],
    };

    const bidStats = {
      labels: ["Pending", "Approved", "Rejected"],
      datasets: [
        {
          data: [
            bids.filter((b) => b.status === "pending").length,
            bids.filter((b) => b.status === "approved").length,
            bids.filter((b) => b.status === "rejected").length,
          ],
          backgroundColor: ["#f59e0b", "#22c55e", "#ef4444"],
        },
      ],
    };

    const leadTrend = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Leads",
          data: [30, 45, 57, 52, 65, 70],
          borderColor: "#3b82f6",
          tension: 0.3,
        },
      ],
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent type="doughnut" data={companyStats} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bid Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent type="pie" data={bidStats} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lead Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent type="line" data={leadTrend} />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTableControls = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
        />
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
      </div>
      <div className="flex gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );

  if (!user || !isAdmin) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "companies", label: "Companies", icon: Users },
            { id: "leads", label: "Leads", icon: FileText },
            { id: "bids", label: "Bids", icon: DollarSign },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Total Companies</p>
                      <p className="text-3xl font-bold">{companies.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Total Leads</p>
                      <p className="text-3xl font-bold">{leads.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Pending Bids</p>
                      <p className="text-3xl font-bold">
                        {bids.filter((b) => b.status === "pending").length}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Active Companies</p>
                      <p className="text-3xl font-bold">
                        {companies.filter((c) => c.is_active).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {renderDashboardCharts()}
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === "companies" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Companies Management</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTableControls()}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredAndPaginatedData(
                        companies,
                        "companies"
                      ).items.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{company.name}</p>
                              <p className="text-sm text-gray-500">
                                {company.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{company.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{company.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {company.city}, {company.state}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                company.is_active ? "default" : "secondary"
                              }
                            >
                              {company.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApproveCompany(company.id)}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleRejectCompany(company.id)}
                                variant="destructive"
                                size="sm"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {renderPagination(
                  getFilteredAndPaginatedData(companies, "companies").totalPages
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leads Management</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTableControls()}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Moving Date</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredAndPaginatedData(leads, "leads").items.map(
                        (lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{lead.name}</p>
                                <p className="text-sm text-gray-500">
                                  {lead.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span>{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span>{lead.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>From: {lead.from_location}</p>
                                <p>To: {lead.to_location}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {lead.moving_date || "Not specified"}
                            </TableCell>
                            <TableCell>
                              <p className="max-w-xs truncate">
                                {lead.message || "No message"}
                              </p>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
                {renderPagination(
                  getFilteredAndPaginatedData(leads, "leads").totalPages
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bids Tab */}
        {activeTab === "bids" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bids Management</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTableControls()}
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UTR Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredAndPaginatedData(bids, "bids").items.map(
                        (bid) => (
                          <TableRow key={bid.id}>
                            <TableCell>
                              <p className="font-medium">
                                {bid.companies?.name}
                              </p>
                            </TableCell>
                            <TableCell>${bid.amount}</TableCell>
                            <TableCell>
                              {bid.utr_number || "Not provided"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  bid.status === "approved"
                                    ? "default"
                                    : bid.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {bid.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    /* Handle approve bid */
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                  size="sm"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => {
                                    /* Handle reject bid */
                                  }}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
                {renderPagination(
                  getFilteredAndPaginatedData(bids, "bids").totalPages
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">UPI ID</label>
                    <Input
                      value={settings.upi_id || ""}
                      placeholder="Enter UPI ID"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Brand Name</label>
                    <Input
                      value={settings.brand_name || ""}
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Support Email</label>
                    <Input
                      value={settings.support_email || ""}
                      placeholder="Enter support email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Support Phone</label>
                    <Input
                      value={settings.support_phone || ""}
                      placeholder="Enter support phone"
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Update Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
