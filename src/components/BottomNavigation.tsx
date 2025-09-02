import React from 'react';
import { Home, Wallet, TrendingUp, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'referrals', label: 'Referrals', icon: TrendingUp },
    { id: 'profile', label: 'Account', icon: User },
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === 'profile') {
      navigate('/profile');
    } else {
      onTabChange(itemId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                (activeTab === item.id || (item.id === 'profile' && window.location.pathname === '/profile'))
                  ? 'text-primary bg-primary/10 shadow-glow-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${(activeTab === item.id || (item.id === 'profile' && window.location.pathname === '/profile')) ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {(activeTab === item.id || (item.id === 'profile' && window.location.pathname === '/profile')) && (
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;