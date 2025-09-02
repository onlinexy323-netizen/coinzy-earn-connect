import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BottomNavigation from './BottomNavigation';
import ModernSidebar from './ModernSidebar';
import CategoryCard from './CategoryCard';
import WalletOverviewCard from './WalletOverviewCard';
import TodaySummaryCard from './TodaySummaryCard';
import CountdownBanner from './CountdownBanner';
import WalletOverview from './WalletOverview';
import GrowthChart from './GrowthChart';
import ActivityFeed from './ActivityFeed';
import CongratulationEffect from './CongratulationEffect';
import ReferralCard from './ReferralCard';
import WithdrawalForm from './WithdrawalForm';
import { useAuthData } from '@/hooks/useAuthData';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';

// Import category images
import fitnessImage from '@/assets/fitness-category.jpg';
import techImage from '@/assets/tech-category.jpg';
import beautyImage from '@/assets/beauty-category.jpg';
import lifestyleImage from '@/assets/lifestyle-category.jpg';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSlotBooked, setIsSlotBooked] = useState(false);
  const [bookedAmount, setBookedAmount] = useState<number>(0);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const { toast } = useToast();
  const { 
    getUserDisplayName, 
    getUserAvatar, 
    primaryAccount,
    getTotalFollowers,
    getConnectedPlatforms 
  } = useSocialMediaData();
  
  const { 
    getUserDisplayName: getAuthDisplayName,
    getUserEmail,
    getUserAvatar: getAuthAvatar
  } = useAuthData();

  // Check if slot booking is currently active (6 PM - 8 PM)
  const isSlotActive = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= 18 && currentHour < 20; // 6 PM to 8 PM
  };

  // User data combining social media and auth data
  const userData = {
    name: getUserDisplayName() || getAuthDisplayName(),
    email: getUserEmail(),
    avatar: getUserAvatar() || getAuthAvatar(),
    socialStats: {
      totalFollowers: getTotalFollowers(),
      connectedPlatforms: getConnectedPlatforms(),
      primaryPlatform: primaryAccount?.platform || null
    }
  };

  // Mock wallet data
  const walletData = {
    totalDeposited: 25000,
    totalEarnings: 3250,
    totalWithdrawn: 8000,
    availableBalance: 12500
  };

  // Mock categories data
  const categories = [
    {
      id: 'fitness',
      name: 'Fitness',
      image: fitnessImage,
      returnRate: 4.5,
      trend: [3.2, 3.8, 4.1, 4.5, 4.3, 4.5, 4.7],
      isActive: isSlotActive()
    },
    {
      id: 'tech',
      name: 'Tech',
      image: techImage,
      returnRate: 5.2,
      trend: [4.8, 5.0, 5.1, 5.3, 5.2, 5.4, 5.2],
      isActive: isSlotActive()
    },
    {
      id: 'beauty',
      name: 'Beauty',
      image: beautyImage,
      returnRate: 3.8,
      trend: [3.5, 3.6, 3.8, 3.7, 3.9, 3.8, 4.0],
      isActive: isSlotActive()
    },
    {
      id: 'lifestyle',
      name: 'Products',
      image: lifestyleImage,
      returnRate: 4.1,
      trend: [3.9, 4.0, 4.1, 4.0, 4.2, 4.1, 4.3],
      isActive: isSlotActive()
    }
  ];

  // Mock referral data
  const referralData = {
    referralCode: 'RK2024',
    referralEarnings: 1250,
    totalReferrals: 8
  };

  // Mock today's booked slots
  const bookedSlots = isSlotBooked ? [
    {
      id: '1',
      category: 'Fitness',
      amount: bookedAmount,
      returnRate: 4.5,
      expectedReturn: Math.round(bookedAmount * 0.045),
      status: 'active' as const
    }
  ] : [];

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

  const handleBookSlot = (categoryId: string) => {
    // For demo, we'll use a fixed amount of ₹1000
    const amount = 1000;
    setIsSlotBooked(true);
    setBookedAmount(amount);
    toast({
      title: "Slot Booked Successfully! 🎉",
      description: `Your ₹${amount} slot in ${categories.find(c => c.id === categoryId)?.name} is now active. Returns will be credited tomorrow at 12 PM.`
    });
  };

  const handleWithdraw = () => {
    setShowWithdrawalForm(true);
  };

  const handleDeposit = () => {
    toast({
      title: "Redirecting to Payment",
      description: "Opening secure payment gateway..."
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 pb-20">
            {/* Welcome Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
                        {userData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {userData.socialStats.primaryPlatform && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-full border-2 border-background flex items-center justify-center">
                        {userData.socialStats.primaryPlatform === 'instagram' && (
                          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        )}
                        {userData.socialStats.primaryPlatform === 'facebook' && (
                          <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        )}
                        {userData.socialStats.primaryPlatform === 'youtube' && (
                          <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {userData.name}
                    </h1>
                    <p className="text-muted-foreground">
                      {userData.socialStats.primaryPlatform 
                        ? `@${primaryAccount?.account_handle} • ${userData.socialStats.primaryPlatform}`
                        : 'Ready to boost your earnings today?'
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Countdown Banner */}
              <CountdownBanner isActive={isSlotActive()} />
            </div>

            {/* Wallet Overview */}
            <WalletOverviewCard 
              balance={walletData.availableBalance}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
            />

            {/* Today's Summary (if user has booked slots) */}
            <TodaySummaryCard bookedSlots={bookedSlots} />

            {/* Ad Categories Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Ad Categories</h2>
                <div className="text-sm text-muted-foreground">Today's returns</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onBookSlot={handleBookSlot}
                    isNewUser={false} // Set to true for new users to show fixed slots only
                  />
                ))}
              </div>
            </div>

            {/* Referral Section */}
            <ReferralCard {...referralData} />
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
      
      case 'referrals':
        return (
          <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">Referrals</h2>
              <div className="text-2xl font-bold text-accent">₹{referralData.referralEarnings.toLocaleString()}</div>
            </div>
            <ReferralCard {...referralData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Referral History</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-card rounded-lg border border-border/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Friend {i} joined</div>
                          <div className="text-sm text-muted-foreground">{i} days ago</div>
                        </div>
                        <div className="text-success font-medium">+₹50</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">How It Works</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">1</div>
                    <div>Share your referral code with friends</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">2</div>
                    <div>They sign up using your code</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">3</div>
                    <div>You both earn ₹50 bonus + 2% lifetime commission</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="space-y-8 pb-20">
            <h2 className="text-3xl font-bold text-foreground">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-card rounded-2xl border border-border/50 shadow-card">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <div className="mt-1 text-lg font-medium">{userData.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="mt-1 text-lg font-medium">{userData.email}</div>
                  </div>
                  {userData.socialStats.primaryPlatform && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Primary Platform</label>
                      <div className="mt-1 text-lg font-medium capitalize">{userData.socialStats.primaryPlatform}</div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Followers</label>
                    <div className="mt-1 text-lg font-medium text-primary">{userData.socialStats.totalFollowers.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-card rounded-2xl border border-border/50 shadow-card">
                <h3 className="text-xl font-semibold mb-4">Account Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Slots Booked</label>
                    <div className="mt-1 text-lg font-medium text-primary">47</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Success Rate</label>
                    <div className="mt-1 text-lg font-medium text-success">96.8%</div>
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
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="font-bold text-lg gradient-primary bg-clip-text text-transparent">
                  SocialSlot
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Ad Slot Booking
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
      
      <WithdrawalForm
        isOpen={showWithdrawalForm}
        onClose={() => setShowWithdrawalForm(false)}
        currentBalance={walletData.availableBalance}
      />
    </div>
  );
};

export default Dashboard;