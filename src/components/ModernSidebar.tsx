import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  User, 
  Users,
  LogOut,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModernSidebarProps {
  activeTab: string;
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: string) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ 
  activeTab, 
  isOpen, 
  onClose, 
  onTabChange 
}) => {
  const sidebarItems = [
    { id: 'agencies', label: 'Agency Profiles', icon: Building2 },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'booked', label: 'Booked Slots', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'team', label: 'My Team', icon: Users },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-card/95 backdrop-blur-xl border-r border-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-premium">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <h2 className="font-bold text-xl text-primary">Coinzy</h2>
                  <p className="text-sm text-muted-foreground">Finance & Social</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'gradient-primary text-white shadow-premium' 
                    : 'hover:bg-muted/50 text-foreground hover:shadow-card'
                }`}
              >
                <item.icon className={`w-5 h-5 ${
                  activeTab === item.id 
                    ? 'text-white' 
                    : 'text-muted-foreground group-hover:text-primary'
                }`} />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="w-full justify-start space-x-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernSidebar;