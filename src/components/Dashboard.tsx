import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus,
  DollarSign,
  Filter,
  Menu,
  Users,
  Star,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import AgencyCard from './AgencyCard';
import HeroBanner from './HeroBanner';
import ProfitabilityInfo from './ProfitabilityInfo';
import BottomNavigation from './BottomNavigation';
import ModernSidebar from './ModernSidebar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('agencies');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Daily Return');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="space-y-6 pb-20">
            {/* Hero Banner */}
            <HeroBanner />
            
            {/* Profitability Info */}
            <ProfitabilityInfo />
            
            <div className="glassmorphism rounded-xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                    Choose Your Agency
                  </h1>
                  <p className="text-muted-foreground">Select a category, book your slot, and start earning daily returns</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select 
                      className="px-4 py-2 border border-border rounded-lg bg-card/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                    className="px-4 py-2 border border-border rounded-lg bg-card/50 backdrop-blur-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredAndSortedAgencies().map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6 pb-20">
            <div className="glassmorphism rounded-xl p-6">
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                Digital Wallet
              </h1>
              <p className="text-muted-foreground">Manage your funds and track investments</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="gradient-primary text-white shadow-premium hover:shadow-cosmic transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 gradient-orbital opacity-50"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center justify-between">
                    <span>Available Balance</span>
                    <DollarSign className="w-6 h-6 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-4xl font-bold mb-2 animate-count-up">$2,847.50</p>
                  <p className="text-sm opacity-90">Ready to invest</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-primary group-hover:text-primary-light transition-colors">
                    Total Invested
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">$12,500</p>
                  <p className="text-sm text-success flex items-center">
                    <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
                    Active investments
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-primary group-hover:text-primary-light transition-colors">
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold gradient-earnings bg-clip-text text-transparent">
                    $1,247.80
                  </p>
                  <p className="text-sm text-muted-foreground">All time</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="hero" className="w-full justify-start">
                    <Plus className="w-4 h-4" />
                    Add Funds
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Withdraw Earnings
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    Investment History
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">FitLife Investment</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <span className="text-destructive">-$499</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Daily Earnings</p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <span className="text-success">+$87.32</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">Beauty Trends ROI</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                    <span className="text-success">+$68.50</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6 pb-20">
            <div className="glassmorphism rounded-xl p-6">
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                Earnings Dashboard
              </h1>
              <p className="text-muted-foreground">Track your Instagram ad revenue in real-time</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="gradient-earnings text-white shadow-premium hover:shadow-cosmic transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>Today's Earnings</span>
                    <DollarSign className="w-5 h-5 opacity-80" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-1">$87.32</p>
                  <p className="text-sm opacity-90 flex items-center">
                    <TrendingUpIcon className="w-3 h-3 mr-1" />
                    +12.5% from yesterday
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary group-hover:text-primary-light transition-colors">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">$542.18</p>
                  <p className="text-sm text-success flex items-center">
                    <TrendingUpIcon className="w-3 h-3 mr-1" />
                    +8.3%
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary group-hover:text-primary-light transition-colors">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">$2,187.65</p>
                  <p className="text-sm text-success flex items-center">
                    <TrendingUpIcon className="w-3 h-3 mr-1" />
                    +15.7%
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-primary group-hover:text-primary-light transition-colors">
                    Avg. Daily Return
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">8.4%</p>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span>Active Campaigns</span>
                    <span className="font-bold text-primary">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span>Total Reach</span>
                    <span className="font-bold text-success">1.2M</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span>Click Rate</span>
                    <span className="font-bold text-accent">3.8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium">FitLife Campaign</p>
                      <p className="text-sm text-muted-foreground">+$24.50 today</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Beauty Trends</p>
                      <p className="text-sm text-muted-foreground">+$18.75 today</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">TechVision</p>
                      <p className="text-sm text-muted-foreground">+$44.07 today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6 pb-20">
            <div className="glassmorphism rounded-xl p-6">
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                My Team
              </h1>
              <p className="text-muted-foreground">Manage your referrals and team earnings</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="gradient-card shadow-premium">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span>Team Members</span>
                    <Users className="w-5 h-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white mb-1">24</p>
                  <p className="text-sm text-white/80">Active referrals</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Team Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-success">$1,247</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Commission Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">15%</p>
                  <p className="text-sm text-muted-foreground">Per referral</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-primary">Referral Link</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value="https://coinzy.app/ref/your-code" 
                    readOnly 
                    className="flex-1 p-3 bg-muted rounded-lg border border-border"
                  />
                  <Button variant="hero">Copy</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6 pb-20">
            <div className="glassmorphism rounded-xl p-6">
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                Profile Settings
              </h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-muted/30 rounded-lg border border-border" 
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-3 bg-muted/30 rounded-lg border border-border" 
                      placeholder="Enter your email" 
                    />
                  </div>
                  <Button variant="hero" className="w-full">Update Profile</Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-primary">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">Change Password</Button>
                  <Button variant="outline" className="w-full">Enable 2FA</Button>
                  <Button variant="outline" className="w-full">Download Data</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20 pb-32">
            <div className="glassmorphism rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
                Coming Soon
              </h2>
              <p className="text-muted-foreground">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-premium">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <h1 className="font-bold text-lg gradient-primary bg-clip-text text-transparent">
                  Coinzy
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Finance & Social
                </p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <div className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
              ● Live
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <ModernSidebar
        activeTab={activeTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-6 lg:ml-80 lg:pl-0">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
};

export default Dashboard;