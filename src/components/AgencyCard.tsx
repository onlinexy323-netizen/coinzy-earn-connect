import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, Calendar, Instagram, Dumbbell, Sparkles, Laptop, CheckCircle, ExternalLink } from 'lucide-react';

interface Agency {
  id: number;
  name: string;
  category: string;
  description: string;
  todayReturn: string;
  totalSlots: number;
  availableSlots: number;
  minInvestment: number;
  rating: number;
  performance: string;
  slotPrice: number;
  dailyEarning: number;
  isConnected?: boolean;
}

interface AgencyCardProps {
  agency: Agency;
}

const AgencyCard: React.FC<AgencyCardProps> = ({ agency }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [countUp, setCountUp] = useState(0);

  React.useEffect(() => {
    const target = parseFloat(agency.todayReturn);
    const increment = target / 30;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCountUp(target);
        clearInterval(timer);
      } else {
        setCountUp(current);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [agency.todayReturn]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Fitness & Health':
        return Dumbbell;
      case 'Beauty & Lifestyle':
        return Sparkles;
      case 'Tech & Innovation':
        return Laptop;
      default:
        return Star;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fitness & Health':
        return 'bg-success/10 text-success border-success/20';
      case 'Beauty & Lifestyle':
        return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'Tech & Innovation':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getReturnColor = (returnRate: string) => {
    const rate = parseFloat(returnRate);
    if (rate >= 8.5) return 'text-success';
    if (rate >= 7.0) return 'text-warning'; 
    return 'text-destructive';
  };

  const getAvailabilityStatus = () => {
    const percentage = (agency.availableSlots / agency.totalSlots) * 100;
    if (percentage > 50) return 'High';
    if (percentage > 20) return 'Medium';
    return 'Low';
  };

  const getAvailabilityColor = () => {
    const status = getAvailabilityStatus();
    switch (status) {
      case 'High':
        return 'text-success';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const CategoryIcon = getCategoryIcon(agency.category);

  return (
    <div 
      className="relative h-full perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <Card className={`group relative h-full transition-all duration-500 transform-style-preserve-3d cursor-pointer border-border hover:border-primary/30 hover:shadow-premium ${isFlipped ? 'rotate-y-180' : ''} ${agency.isConnected ? 'border-success/50 shadow-success/20' : ''}`}>
        
        {/* Front Side */}
        <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CategoryIcon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-primary group-hover:text-primary-light transition-colors">
                    {agency.name}
                  </h3>
                </div>
                <Badge variant="secondary" className={getCategoryColor(agency.category)}>
                  {agency.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{agency.rating}</span>
              </div>
            </div>

            {/* Instagram Connection Status */}
            <div className={`flex items-center justify-between p-3 rounded-lg border ${agency.isConnected ? 'bg-success/10 border-success/20' : 'bg-primary/10 border-primary/20'}`}>
              <div className="flex items-center space-x-2">
                <Instagram className={`w-4 h-4 ${agency.isConnected ? 'text-success' : 'text-primary'}`} />
                <span className="text-sm font-medium">
                  {agency.isConnected ? 'Connected & Earning' : 'Your Instagram Account Will Run Ads Here'}
                </span>
              </div>
              {agency.isConnected && <CheckCircle className="w-5 h-5 text-success" />}
            </div>
          </CardHeader>
      
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Daily Return</p>
                <p className={`text-3xl font-bold transition-all duration-300 hover:scale-110 ${getReturnColor(agency.todayReturn)}`}>
                  {countUp.toFixed(1)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Slot Price</p>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-bold text-primary">₹{agency.slotPrice}</span>
                </div>
                <p className="text-xs text-muted-foreground">~₹{agency.dailyEarning}/day</p>
              </div>
            </div>

        {/* Slot Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Available Slots</span>
            </div>
            <span className={`font-semibold ${getAvailabilityColor()}`}>
              {agency.availableSlots}/{agency.totalSlots}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="gradient-earnings h-2 rounded-full transition-all duration-300"
              style={{ width: `${(agency.availableSlots / agency.totalSlots) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Min. Investment</span>
            </div>
            <span className="font-semibold">${agency.minInvestment}</span>
          </div>
        </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button 
                variant={agency.isConnected ? "premium" : "hero"}
                className="flex-1 group-hover:scale-105 transition-transform"
                disabled={agency.availableSlots === 0}
              >
                {agency.availableSlots === 0 ? 'Sold Out' : agency.isConnected ? 'Connected' : 'Book Slot'}
              </Button>
              {!agency.isConnected && (
                <Button variant="outline" size="icon" className="border-primary/50 hover:bg-primary/10">
                  <Instagram className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </div>

        {/* Back Side - Flip Animation */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
          <CardHeader className="space-y-4">
            <div className="text-center">
              <CategoryIcon className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold text-primary mb-2">{agency.category}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {agency.description}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Estimated Monthly Earnings</h4>
              <div className="text-3xl font-bold text-success">
                ₹{Math.round(agency.dailyEarning * 30)}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on ₹{agency.slotPrice} investment
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Success Rate</span>
                <span className="font-semibold text-success">94.2%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Avg. Campaign Duration</span>
                <span className="font-semibold">30 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Min. Followers Required</span>
                <span className="font-semibold">1K+</span>
              </div>
            </div>
            
            <Button variant="hero" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default AgencyCard;