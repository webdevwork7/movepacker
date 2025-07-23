
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Users, 
  FileText, 
  DollarSign, 
  Eye,
  Check,
  X,
  LogOut,
  Shield,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';

interface AdminSettings {
  upi_id?: string;
  brand_name?: string;
  support_email?: string;
  support_phone?: string;
}

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [leads, setLeads] = useState([]);
  const [bids, setBids] = useState([]);
  const [settings, setSettings] = useState<AdminSettings>({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      // Simple password check (in production, use proper hashing)
      if (email === 'admin@gmail.com' && password === 'admin@123') {
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel!",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch bids
      const { data: bidsData } = await supabase
        .from('bids')
        .select('*, companies(name)')
        .order('created_at', { ascending: false });

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*');

      setCompanies(companiesData || []);
      setLeads(leadsData || []);
      setBids(bidsData || []);
      
      const settingsObj: AdminSettings = {};
      settingsData?.forEach(setting => {
        settingsObj[setting.key as keyof AdminSettings] = setting.value;
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleApproveCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: true })
        .eq('id', companyId);

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
        .from('companies')
        .update({ is_active: false })
        .eq('id', companyId);

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
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
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'companies', label: 'Companies', icon: Users },
            { id: 'leads', label: 'Leads', icon: FileText },
            { id: 'bids', label: 'Bids', icon: DollarSign },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
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
                    <p className="text-3xl font-bold">{bids.filter(b => b.status === 'pending').length}</p>
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
                    <p className="text-3xl font-bold">{companies.filter(c => c.is_active).length}</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Companies Management</h2>
            {companies.map((company) => (
              <Card key={company.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{company.name}</h3>
                      <p className="text-gray-600">{company.email}</p>
                      <p className="text-gray-600">{company.phone}</p>
                      <Badge variant={company.is_active ? 'default' : 'secondary'}>
                        {company.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Leads Management</h2>
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{lead.name}</h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {lead.email}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {lead.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <strong>From:</strong> {lead.from_location}
                      </p>
                      <p className="text-gray-600">
                        <strong>To:</strong> {lead.to_location}
                      </p>
                      <p className="text-gray-600">
                        <strong>Date:</strong> {lead.moving_date || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  {lead.message && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm">{lead.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bids Tab */}
        {activeTab === 'bids' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Bids Management</h2>
            {bids.map((bid) => (
              <Card key={bid.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{bid.companies?.name}</h3>
                      <p className="text-gray-600">Amount: ${bid.amount}</p>
                      <p className="text-gray-600">UTR: {bid.utr_number || 'Not provided'}</p>
                      <Badge variant={
                        bid.status === 'approved' ? 'default' : 
                        bid.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {bid.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {/* Handle approve bid */}}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => {/* Handle reject bid */}}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">System Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">UPI ID</label>
                    <Input value={settings.upi_id || ''} placeholder="Enter UPI ID" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Brand Name</label>
                    <Input value={settings.brand_name || ''} placeholder="Enter brand name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Support Email</label>
                    <Input value={settings.support_email || ''} placeholder="Enter support email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Support Phone</label>
                    <Input value={settings.support_phone || ''} placeholder="Enter support phone" />
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
