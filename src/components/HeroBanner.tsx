import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Instagram, Coins, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroBanner = () => {
  return (
    <Card className="gradient-primary text-white border-0 mb-8 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 animate-pulse">
          <Coins className="w-16 h-16" />
        </div>
        <div className="absolute bottom-4 left-4 animate-bounce">
          <Instagram className="w-12 h-12" />
        </div>
      </div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                <Instagram className="w-5 h-5 text-pink-300" />
                <span className="text-sm font-medium">Instagram</span>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60" />
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                <Coins className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Daily Returns</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-3 leading-tight">
              Your Instagram Ads Are Ready to<br />
              <span className="text-yellow-300">Earn You Daily Returns</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-6 max-w-2xl">
              Choose an agency category, book a slot, and watch your earnings grow while your Instagram account runs profitable ads
            </p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-300" />
                <span className="text-sm">Up to 9.1% daily returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-pink-300" />
                <span className="text-sm">100% automated ads</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="w-32 h-32 rounded-full gradient-earnings flex items-center justify-center animate-pulse">
                <div className="text-center">
                  <Coins className="w-8 h-8 mx-auto mb-2" />
                  <span className="text-2xl font-bold">8.4%</span>
                  <p className="text-xs opacity-80">Avg Daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroBanner;