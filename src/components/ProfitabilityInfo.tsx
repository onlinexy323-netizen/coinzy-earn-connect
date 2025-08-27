import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ProfitabilityInfo = () => {
  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-background to-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Target className="w-5 h-5 text-primary" />
          <span>How much you can earn daily</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Earning Examples */}
          <div className="space-y-4">
            <h4 className="font-semibold text-muted-foreground">Slot Investment → Daily Return</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="font-medium">₹499 slot</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-success">~₹30/day</span>
                  <p className="text-xs text-muted-foreground">6% daily</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-medium">₹999 slot</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary">~₹60/day</span>
                  <p className="text-xs text-muted-foreground">6% daily</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-warning" />
                  <span className="font-medium">₹1999 slot</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-warning">~₹140/day</span>
                  <p className="text-xs text-muted-foreground">7% daily</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Monthly Projection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-muted-foreground">Projected Monthly Earnings</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">₹499 Investment</span>
                  <span className="font-bold text-success">₹900</span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">180% monthly return</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">₹999 Investment</span>
                  <span className="font-bold text-primary">₹1,800</span>
                </div>
                <Progress value={80} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">180% monthly return</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">₹1999 Investment</span>
                  <span className="font-bold text-warning">₹4,200</span>
                </div>
                <Progress value={95} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">210% monthly return</p>
              </div>
            </div>
          </div>
          
          {/* Performance Stats */}
          <div className="space-y-4">
            <h4 className="font-semibold text-muted-foreground">Platform Performance</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Daily Return</span>
                <span className="font-bold text-success">8.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-bold text-success">94.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Investors</span>
                <span className="font-bold">12,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Paid Out</span>
                <span className="font-bold text-primary">₹2.4M</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Live Earnings</span>
              </div>
              <div className="text-2xl font-bold text-primary animate-pulse">
                ₹42,387
              </div>
              <p className="text-xs text-muted-foreground">earned by users today</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitabilityInfo;