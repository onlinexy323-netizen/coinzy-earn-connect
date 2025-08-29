import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import ModernSidebar from './ModernSidebar';
import WelcomeHeader from './WelcomeHeader';
import QuickActions from './QuickActions';
import SlotBookingCard from './SlotBookingCard';
import WalletOverview from './WalletOverview';
import GrowthChart from './GrowthChart';
import ActivityFeed from './ActivityFeed';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSlotBooked, setIsSlotBooked] = useState(false);
  const [bookedAmount, setBookedAmount] = useState<number>(0);
  const { toast } = useToast();

  // Mock user data
  const userData = {
    name: 'Rajesh Kumar',
    avatar: undefined
  };

  // Mock stats data
  const statsData = {
    todayEarning: 245,
    activeSlots: 2,
    walletBalance: 12500
  };

  // Mock wallet data
  const walletData = {
    totalDeposited: 25000,
    totalEarnings: 3250,
    totalWithdrawn: 8000,
    availableBalance: 12500
  };

  // Mock chart data
  const chartData = [
    { date: '1 Jan', deposits: 5000, earnings: 225, withdrawals: 0, balance: 5225 },
    { date: '5 Jan', deposits: 7000, earnings: 540, withdrawals: 0, balance: 7540 },
    { date: '10 Jan', deposits: 10000, earnings: 890, withdrawals: 2000, balance: 8890 },
    { date: '15 Jan', deposits: 15000, earnings: 1340, withdrawals: 3000, balance: 13340 },
    { date: '20 Jan', deposits: 20000, earnings: 1820, withdrawals: 5000, balance: 16820 },
    { date: '25 Jan', deposits: 25000, earnings: 2350, withdrawals: 8000, balance: 19350 },
    { date: '30 Jan', deposits: 25000, earnings: 3250, withdrawals: 8000, balance: 20250 }
  ];

  // Mock activity data
  const activityData = [
    {
      id: '1',
      type: 'earning' as const,
      description: 'Earning credited +₹125 (4.5%)',
      amount: 125,
      timestamp: '2 hours ago',
      status: 'completed' as const
    },
    {
      id: '2',
      type: 'booking' as const,
      description: 'You booked ₹2,500 slot',
      amount: 2500,
      timestamp: '1 day ago',
      status: 'completed' as const
    },
    {
      id: '3',
      type: 'withdrawal' as const,
      description: 'Withdrawal request of ₹1,000 submitted',
      amount: 1000,
      timestamp: '2 days ago',
      status: 'pending' as const
    },
    {
      id: '4',
      type: 'deposit' as const,
      description: 'Deposit of ₹5,000 credited',
      amount: 5000,
      timestamp: '3 days ago',
      status: 'completed' as const
    }
  ];

  const handleBookSlot = (amount: number) => {
    setIsSlotBooked(true);
    setBookedAmount(amount);
    toast({
      title: "Slot Booked Successfully! 🎉",
      description: `Your ₹${amount} slot is now active. Returns will be credited tomorrow at 12 PM.`
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Initiated",
      description: "Your withdrawal request has been submitted and will be processed within 2 hours."
    });
  };

  // Check if slot booking is currently active (6 PM - 10 PM)
  const isSlotActive = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 18 && currentHour < 22; // 6 PM to 10 PM
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8">
            <WelcomeHeader user={userData} stats={statsData} />
            <QuickActions 
              onBookSlot={() => {}} 
              onWithdraw={handleWithdraw} 
              isSlotActive={isSlotActive()} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SlotBookingCard 
                isBooked={isSlotBooked}
                bookedAmount={bookedAmount}
                onBookSlot={handleBookSlot}
              />
              <div className="space-y-8">
                <WalletOverview walletData={walletData} />
              </div>
            </div>
            
            <GrowthChart data={chartData} />
            <ActivityFeed activities={activityData} />
          </div>
        );
      
      case 'wallet':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Your Wallet</h2>
              <div className="text-2xl font-bold text-primary">₹{walletData.availableBalance.toLocaleString()}</div>
            </div>
            <WalletOverview walletData={walletData} />
            <GrowthChart data={chartData} />
            <ActivityFeed activities={activityData.filter(a => a.type === 'deposit' || a.type === 'withdrawal')} />
          </div>
        );
      
      case 'earnings':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Earnings Overview</h2>
              <div className="text-2xl font-bold text-green-500">₹{walletData.totalEarnings.toLocaleString()}</div>
            </div>
            <WelcomeHeader user={userData} stats={statsData} />
            <GrowthChart data={chartData} />
            <ActivityFeed activities={activityData.filter(a => a.type === 'earning')} />
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <div className="mt-1 text-lg font-medium">{userData.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="mt-1 text-lg font-medium">rajesh@example.com</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <div className="mt-1 text-lg font-medium">+91 98765 43210</div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Account Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Slots Booked</label>
                    <div className="mt-1 text-lg font-medium text-blue-500">47</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Success Rate</label>
                    <div className="mt-1 text-lg font-medium text-green-500">96.8%</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                    <div className="mt-1 text-lg font-medium">January 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Select a tab to view content</div>;
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
      <main className="pt-16 min-h-screen relative overflow-hidden">
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 gradient-orbital opacity-20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 gradient-cosmic opacity-15 rounded-full blur-2xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 gradient-earnings opacity-10 rounded-full blur-xl animate-pulse"></div>
        </div>
        
        {/* Enhanced Container */}
        <div className="relative z-10 container mx-auto px-4 py-8 lg:ml-80 lg:pl-0 max-w-7xl">
          <div className="min-h-[calc(100vh-8rem)]">
            {/* Content Wrapper with Glassmorphism */}
            <div className="relative">
              {/* Subtle Grid Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none" 
                   style={{
                     backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
                     backgroundSize: '24px 24px'
                   }}>
              </div>
              
              {/* Main Content */}
              <div className="relative z-10 space-y-8">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none"></div>
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