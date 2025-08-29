import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Zap } from 'lucide-react';

interface CountdownBannerProps {
  isActive: boolean;
}

const CountdownBanner: React.FC<CountdownBannerProps> = ({ isActive }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      let targetTime: Date;
      
      if (currentHour < 18) {
        // Before 6 PM - countdown to 6 PM today
        targetTime = new Date();
        targetTime.setHours(18, 0, 0, 0);
      } else if (currentHour < 20) {
        // Between 6-8 PM - countdown to 8 PM today (end of booking window)
        targetTime = new Date();
        targetTime.setHours(20, 0, 0, 0);
      } else {
        // After 8 PM - countdown to 6 PM tomorrow
        targetTime = new Date();
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(18, 0, 0, 0);
      }

      const diff = targetTime.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const getMessage = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (currentHour >= 18 && currentHour < 20) {
      return "Booking window is LIVE! Book your slots now!";
    } else if (currentHour < 18) {
      return "Book slots between 6 PM – 8 PM";
    } else {
      return "Next booking window starts at 6 PM tomorrow";
    }
  };

  return (
    <Card className={`border-2 transition-all duration-300 ${
      isActive 
        ? 'border-success bg-gradient-to-r from-success/10 to-primary/10 shadow-glow-secondary animate-pulse' 
        : 'border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isActive ? 'bg-success shadow-glow-secondary' : 'bg-primary'
            }`}>
              {isActive ? (
                <Zap className="w-5 h-5 text-white animate-pulse" />
              ) : (
                <Clock className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className={`font-semibold ${isActive ? 'text-success' : 'text-foreground'}`}>
                {getMessage()}
              </div>
              <div className="text-sm text-muted-foreground">
                {isActive ? 'Window closes in:' : 'Time remaining:'}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-xl font-bold font-mono ${
              isActive ? 'text-success' : 'text-primary'
            }`}>
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-muted-foreground">H:M:S</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownBanner;