import React from 'react';
import { Home, Wallet, TrendingUp, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'agencies', label: 'Home', icon: Home },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around items-center h-16 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10 shadow-glow-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
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