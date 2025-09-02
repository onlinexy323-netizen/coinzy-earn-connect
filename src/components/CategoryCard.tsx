import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import InvestmentSlotForm from './InvestmentSlotForm';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image: string;
    returnRate: number;
    trend: number[];
    isActive: boolean;
  };
  onBookSlot: (categoryId: string, amount: number) => void;
  isNewUser?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onBookSlot, isNewUser = false }) => {
  const MiniChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return (
      <div className="flex items-end h-8 space-x-1">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isIncreasing = index > 0 && value > data[index - 1];
          return (
            <div
              key={index}
              className={`w-1 rounded-sm transition-all duration-500 ${
                isIncreasing 
                  ? 'bg-gradient-to-t from-green-500 to-green-400 animate-pulse' 
                  : 'bg-gradient-to-t from-success to-success/60'
              }`}
              style={{ 
                height: `${Math.max(height, 10)}%`,
                animationDelay: `${index * 100}ms`
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-card-hover transition-all duration-300 border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary p-2 shadow-card">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{category.name}</h3>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-success font-medium text-sm">+{category.returnRate}%</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Today's Growth</div>
            <MiniChart data={category.trend} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {isNewUser ? "Fixed slots available" : "Custom amounts allowed"}
          </div>
          
          <InvestmentSlotForm 
            category={category}
            onBookSlot={onBookSlot}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;