import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Users, Calendar } from 'lucide-react';

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
}

interface AgencyCardProps {
  agency: Agency;
}

const AgencyCard: React.FC<AgencyCardProps> = ({ agency }) => {
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

  return (
    <Card className="group hover:shadow-premium transition-all duration-300 cursor-pointer border-border hover:border-primary/30">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-primary group-hover:text-primary-light transition-colors">
              {agency.name}
            </h3>
            <Badge variant="secondary" className={getCategoryColor(agency.category)}>
              {agency.category}
            </Badge>
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{agency.rating}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {agency.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Today's Return</p>
            <p className="text-2xl font-bold text-success">{agency.todayReturn}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Performance</p>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-success">{agency.performance}</span>
            </div>
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
            variant="hero" 
            className="flex-1 group-hover:scale-105 transition-transform"
            disabled={agency.availableSlots === 0}
          >
            {agency.availableSlots === 0 ? 'Sold Out' : 'Book Slot'}
          </Button>
          <Button variant="outline" size="icon">
            <TrendingUp className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgencyCard;