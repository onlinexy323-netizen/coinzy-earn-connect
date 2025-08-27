import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '@/components/ui/sidebar';
import { 
  Building2, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  User, 
  LogOut,
  Plus,
  Eye,
  ArrowUpRight,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AgencyCard from './AgencyCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('agencies');

  const sidebarItems = [
    { id: 'agencies', label: 'Agency Profiles', icon: Building2 },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'booked', label: 'Booked Slots', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const mockAgencies = [
    {
      id: 1,
      name: 'FitLife Global',
      category: 'Fitness & Health',
      description: 'Leading fitness influencer network with global reach',
      todayReturn: '8.2%',
      totalSlots: 50,
      availableSlots: 12,
      minInvestment: 100,
      rating: 4.8,
      performance: '+2.1%'
    },
    {
      id: 2,
      name: 'Beauty Trends Int.',
      category: 'Beauty & Lifestyle',
      description: 'Premium beauty and lifestyle advertising agency',
      todayReturn: '7.8%',
      totalSlots: 30,
      availableSlots: 8,
      minInvestment: 150,
      rating: 4.6,
      performance: '+1.8%'
    },
    {
      id: 3,
      name: 'TechVision Agency',
      category: 'Tech & Innovation',
      description: 'Cutting-edge technology advertising solutions',
      todayReturn: '9.1%',
      totalSlots: 40,
      availableSlots: 15,
      minInvestment: 200,
      rating: 4.9,
      performance: '+3.2%'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'agencies':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Agency Profiles</h1>
                <p className="text-muted-foreground">Choose from verified international ad agencies</p>
              </div>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-border rounded-md bg-background">
                  <option>All Categories</option>
                  <option>Fitness & Health</option>
                  <option>Beauty & Lifestyle</option>
                  <option>Tech & Innovation</option>
                </select>
                <select className="px-4 py-2 border border-border rounded-md bg-background">
                  <option>Sort by Return</option>
                  <option>Sort by Rating</option>
                  <option>Sort by Available Slots</option>
                </select>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockAgencies.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">Wallet</h1>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Available Balance</span>
                    <DollarSign className="w-5 h-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">$2,847.50</p>
                  <p className="text-sm text-muted-foreground">Ready to invest</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Invested</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">$12,500</p>
                  <p className="text-sm text-success">Active investments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-success">$1,247.80</p>
                  <p className="text-sm text-muted-foreground">All time</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex space-x-4">
              <Button variant="hero">
                <Plus className="w-4 h-4" />
                Add Funds
              </Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">Earnings Overview</h1>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="gradient-earnings text-white">
                <CardHeader>
                  <CardTitle>Today's Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$87.32</p>
                  <p className="text-sm opacity-90">+12.5% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$542.18</p>
                  <p className="text-sm text-success">+8.3%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">$2,187.65</p>
                  <p className="text-sm text-success">+15.7%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Avg. Daily Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">8.4%</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-primary mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-primary">Coinzy</h2>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full justify-start space-x-3 p-3 rounded-lg transition-all ${
                      activeTab === item.id 
                        ? 'bg-primary text-primary-foreground shadow-card' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <div className="mt-auto pt-6">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start space-x-3 text-muted-foreground hover:text-foreground">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </Button>
              </Link>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;