import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Company, Lead, AdminSettings } from "@/types/database";
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
  Star,
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
import { format, parseISO } from "date-fns";

type DataType = "companies" | "leads" | "bids";
type SortOrder = "asc" | "desc";

export const Admin = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
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

  // Add handlers and state for editing/deleting leads
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setEditForm(lead);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEditLead = async () => {
    if (!editingLead) return;
    try {
      const { error } = await supabase
        .from("leads")
        .update(editForm)
        .eq("id", editingLead.id);
      if (error) throw error;
      toast({ title: "Lead updated" });
      setEditingLead(null);
      fetchData();
    } catch (error: unknown) {
      let message = "Failed to update lead";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message: string }).message;
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase.from("leads").delete().eq("id", leadId);
      if (error) throw error;
      toast({ title: "Lead deleted" });
      fetchData();
    } catch (error: unknown) {
      let message = "Failed to delete lead";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message: string }).message;
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

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
  }, [user, isAdmin, navigate]);

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

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("settings")
        .select("*");

      setCompanies(companiesData || []);
      setLeads(leadsData || []);

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
    } catch (error: unknown) {
      let message = "Failed to approve company";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message: string }).message;
      }
      toast({ title: "Error", description: message, variant: "destructive" });
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
    } catch (error: unknown) {
      let message = "Failed to reject company";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message: string }).message;
      }
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getFilteredData = <T extends Company | Lead>(
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

  const getFilteredAndPaginatedData = <T extends Company | Lead>(
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

  // Dashboard stats helpers
  const getLeadsPerMonth = () => {
    const counts: { [key: string]: number } = {};
    leads.forEach((lead) => {
      const month = format(parseISO(lead.created_at), "yyyy-MM");
      counts[month] = (counts[month] || 0) + 1;
    });
    // Sort months chronologically
    const sortedMonths = Object.keys(counts).sort();
    return {
      labels: sortedMonths,
      data: sortedMonths.map((m) => counts[m]),
    };
  };

  const getLeadsStats = () => {
    const now = new Date();
    const thisMonth = format(now, "yyyy-MM");
    const lastMonth = format(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
      "yyyy-MM"
    );
    let totalThisMonth = 0;
    let totalLastMonth = 0;
    const monthCounts: { [key: string]: number } = {};
    leads.forEach((lead) => {
      const month = format(parseISO(lead.created_at), "yyyy-MM");
      monthCounts[month] = (monthCounts[month] || 0) + 1;
      if (month === thisMonth) totalThisMonth++;
      if (month === lastMonth) totalLastMonth++;
    });
    const avgPerMonth =
      Object.values(monthCounts).reduce((a, b) => a + b, 0) /
      (Object.keys(monthCounts).length || 1);
    return {
      totalThisMonth,
      totalLastMonth,
      avgPerMonth: Math.round(avgPerMonth),
    };
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

    const leadsPerMonth = getLeadsPerMonth();
    const leadsStats = getLeadsStats();

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
            <CardTitle>Leads Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              type="bar"
              data={{
                labels: leadsPerMonth.labels,
                datasets: [
                  {
                    label: "Leads",
                    data: leadsPerMonth.data,
                    backgroundColor: "#3b82f6",
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-bold">
                  {leadsStats.totalThisMonth}
                </p>
                <p className="text-gray-600">Leads this month</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {leadsStats.totalLastMonth}
                </p>
                <p className="text-gray-600">Leads last month</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{leadsStats.avgPerMonth}</p>
                <p className="text-gray-600">Avg. leads/month</p>
              </div>
            </div>
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
                      <p className="text-gray-600">Active Companies</p>
                      <p className="text-3xl font-bold">
                        {companies.filter((c) => c.is_active).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Avg. Company Rating</p>
                      <p className="text-3xl font-bold">
                        {companies.length > 0
                          ? (
                              companies.reduce((sum, c) => sum + c.rating, 0) /
                              companies.length
                            ).toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Dashboard Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Top Cities by Lead Volume */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Cities by Lead Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartComponent
                    type="bar"
                    data={{
                      labels: Object.entries(
                        leads.reduce((acc, lead) => {
                          acc[lead.from_location] =
                            (acc[lead.from_location] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([city]) => city),
                      datasets: [
                        {
                          label: "Leads",
                          data: Object.entries(
                            leads.reduce((acc, lead) => {
                              acc[lead.from_location] =
                                (acc[lead.from_location] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          )
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([, count]) => count),
                          backgroundColor: "#6366f1",
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
              {/* Company Growth Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartComponent
                    type="line"
                    data={{
                      labels: (() => {
                        const counts: Record<string, number> = {};
                        companies.forEach((c) => {
                          const month = format(
                            parseISO(c.created_at),
                            "yyyy-MM"
                          );
                          counts[month] = (counts[month] || 0) + 1;
                        });
                        return Object.keys(counts).sort();
                      })(),
                      datasets: [
                        {
                          label: "New Companies",
                          data: (() => {
                            const counts: Record<string, number> = {};
                            companies.forEach((c) => {
                              const month = format(
                                parseISO(c.created_at),
                                "yyyy-MM"
                              );
                              counts[month] = (counts[month] || 0) + 1;
                            });
                            return Object.keys(counts)
                              .sort()
                              .map((m) => counts[m]);
                          })(),
                          borderColor: "#10b981",
                          backgroundColor: "#6ee7b7",
                          tension: 0.3,
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
              {/* Leads by Destination State */}
              <Card>
                <CardHeader>
                  <CardTitle>Leads by Destination State</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartComponent
                    type="pie"
                    data={{
                      labels: Object.entries(
                        leads.reduce((acc, lead) => {
                          acc[lead.to_location] =
                            (acc[lead.to_location] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([state]) => state),
                      datasets: [
                        {
                          data: Object.entries(
                            leads.reduce((acc, lead) => {
                              acc[lead.to_location] =
                                (acc[lead.to_location] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          )
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 6)
                            .map(([, count]) => count),
                          backgroundColor: [
                            "#f59e42",
                            "#3b82f6",
                            "#10b981",
                            "#6366f1",
                            "#f43f5e",
                            "#a21caf",
                          ],
                        },
                      ],
                    }}
                  />
                </CardContent>
              </Card>
              {/* Top Rated Companies */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Rated Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companies
                      .slice()
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 3)
                      .map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg shadow-sm"
                        >
                          <div className="flex flex-col flex-1">
                            <span className="font-semibold text-lg">
                              {company.name}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {company.city}, {company.state}
                            </span>
                          </div>
                          <span className="text-yellow-500 font-bold text-xl flex items-center gap-1">
                            <Star className="w-5 h-5" />{" "}
                            {company.rating.toFixed(1)}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Leads Table */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">From</th>
                          <th className="px-4 py-2 text-left">To</th>
                          <th className="px-4 py-2 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads
                          .slice()
                          .sort(
                            (a, b) =>
                              parseISO(b.created_at).getTime() -
                              parseISO(a.created_at).getTime()
                          )
                          .slice(0, 5)
                          .map((lead) => (
                            <tr key={lead.id} className="border-b">
                              <td className="px-4 py-2">{lead.name}</td>
                              <td className="px-4 py-2">{lead.email}</td>
                              <td className="px-4 py-2">
                                {lead.from_location}
                              </td>
                              <td className="px-4 py-2">{lead.to_location}</td>
                              <td className="px-4 py-2">
                                {lead.moving_date || "N/A"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                              {company.is_active ? "Approved" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {company.is_active ? (
                                <Button
                                  onClick={() =>
                                    handleRejectCompany(company.id)
                                  }
                                  variant="destructive"
                                  size="sm"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    handleApproveCompany(company.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                  size="sm"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                              )}
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
                        <TableHead>Actions</TableHead>
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
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleEditLead(lead)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                  size="sm"
                                >
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  Delete
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
                  getFilteredAndPaginatedData(leads, "leads").totalPages
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bids Tab */}
        {activeTab === "bids" && <></>}

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
      {editingLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingLead(null);
          }}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Edit Lead</h2>
            <div className="space-y-2">
              <Input
                name="name"
                value={editForm.name || ""}
                onChange={handleEditFormChange}
                placeholder="Name"
              />
              <Input
                name="email"
                value={editForm.email || ""}
                onChange={handleEditFormChange}
                placeholder="Email"
              />
              <Input
                name="phone"
                value={editForm.phone || ""}
                onChange={handleEditFormChange}
                placeholder="Phone"
              />
              <Input
                name="from_location"
                value={editForm.from_location || ""}
                onChange={handleEditFormChange}
                placeholder="From Location"
              />
              <Input
                name="to_location"
                value={editForm.to_location || ""}
                onChange={handleEditFormChange}
                placeholder="To Location"
              />
              <Input
                name="moving_date"
                value={editForm.moving_date || ""}
                onChange={handleEditFormChange}
                placeholder="Moving Date"
              />
              <Input
                name="message"
                value={editForm.message || ""}
                onChange={handleEditFormChange}
                placeholder="Message"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSaveEditLead}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
              <Button onClick={() => setEditingLead(null)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
