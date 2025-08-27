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
  BarChart3,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AgencyCard from './AgencyCard';
import HeroBanner from './HeroBanner';
import ProfitabilityInfo from './ProfitabilityInfo';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('agencies');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Daily Return');

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
      description: 'Leading fitness influencer network with global reach and premium wellness campaigns',
      todayReturn: '8.2',
      totalSlots: 50,
      availableSlots: 12,
      minInvestment: 100,
      rating: 4.8,
      performance: '+2.1%',
      slotPrice: 999,
      dailyEarning: 60,
      isConnected: true
    },
    {
      id: 2,
      name: 'Beauty Trends Int.',
      category: 'Beauty & Lifestyle',
      description: 'Premium beauty and lifestyle advertising agency with luxury brand partnerships',
      todayReturn: '7.8',
      totalSlots: 30,
      availableSlots: 8,
      minInvestment: 150,
      rating: 4.6,
      performance: '+1.8%',
      slotPrice: 499,
      dailyEarning: 30,
      isConnected: false
    },
    {
      id: 3,
      name: 'TechVision Agency',
      category: 'Tech & Innovation',
      description: 'Cutting-edge technology advertising solutions for modern digital campaigns',
      todayReturn: '9.1',
      totalSlots: 40,
      availableSlots: 15,
      minInvestment: 200,
      rating: 4.9,
      performance: '+3.2%',
      slotPrice: 1999,
      dailyEarning: 140,
      isConnected: false
    },
    {
      id: 4,
      name: 'Wellness Pro',
      category: 'Fitness & Health',
      description: 'Specialized health and wellness campaigns with medical brand collaborations',
      todayReturn: '6.8',
      totalSlots: 25,
      availableSlots: 5,
      minInvestment: 100,
      rating: 4.7,
      performance: '+1.2%',
      slotPrice: 499,
      dailyEarning: 25,
      isConnected: true
    },
    {
      id: 5,
      name: 'Glamour Studios',
      category: 'Beauty & Lifestyle',
      description: 'High-end beauty campaigns featuring top cosmetic brands and fashion collaborations',
      todayReturn: '8.9',
      totalSlots: 35,
      availableSlots: 18,
      minInvestment: 180,
      rating: 4.8,
      performance: '+2.8%',
      slotPrice: 1999,
      dailyEarning: 120,
      isConnected: false
    },
    {
      id: 6,
      name: 'Innovation Hub',
      category: 'Tech & Innovation',
      description: 'AI and blockchain technology campaigns with startup and enterprise partnerships',
      todayReturn: '7.2',
      totalSlots: 20,
      availableSlots: 3,
      minInvestment: 250,
      rating: 4.9,
      performance: '+1.9%',
      slotPrice: 999,
      dailyEarning: 55,
      isConnected: true
    }
  ];

  const getFilteredAndSortedAgencies = () => {
    let filtered = mockAgencies;
    
    // Filter by category
    if (categoryFilter !== 'All Categories') {
      filtered = filtered.filter(agency => agency.category === categoryFilter);
    }
    
    // Sort agencies
    switch (sortBy) {
      case 'Daily Return':
        filtered.sort((a, b) => parseFloat(b.todayReturn) - parseFloat(a.todayReturn));
        break;
      case 'Price (Low to High)':
        filtered.sort((a, b) => a.slotPrice - b.slotPrice);
        break;
      case 'Price (High to Low)':
        filtered.sort((a, b) => b.slotPrice - a.slotPrice);
        break;
      case 'Rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Available Slots':
        filtered.sort((a, b) => b.availableSlots - a.availableSlots);
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'agencies':
        return (
          <div className="space-y-6">
            {/* Hero Banner */}
            <HeroBanner />
            
            {/* Profitability Info */}
            <ProfitabilityInfo />
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Choose Your Agency</h1>
                <p className="text-muted-foreground">Select a category, book your slot, and start earning daily returns</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select 
                    className="px-4 py-2 border border-border rounded-md bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option>All Categories</option>
                    <option>Fitness & Health</option>
                    <option>Beauty & Lifestyle</option>
                    <option>Tech & Innovation</option>
                  </select>
                </div>
                <select 
                  className="px-4 py-2 border border-border rounded-md bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Daily Return</option>
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Rating</option>
                  <option>Available Slots</option>
                </select>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredAndSortedAgencies().map((agency) => (
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