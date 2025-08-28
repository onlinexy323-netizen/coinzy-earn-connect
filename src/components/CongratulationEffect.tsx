import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, DollarSign, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CongratulationEffectProps {
  platform: string;
}

const CongratulationEffect = ({ platform }: CongratulationEffectProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  // Confetti particles
  const confettiColors = ['#3B82F6', '#00D4FF', '#B347FF', '#22C55E', '#F59E0B'];
  
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Cosmic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 gradient-orbital rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-56 h-56 gradient-orbital rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 gradient-orbital rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <Card className="glassmorphism shadow-premium border-0 overflow-hidden">
          <CardContent className="p-12 text-center space-y-8">
            {/* Success Icon with Animation */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto gradient-primary rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-accent animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-pulse delay-500" />
              <Star className="absolute top-0 -left-4 w-6 h-6 text-warning animate-pulse delay-1000" />
            </div>

            {/* Main Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent animate-fade-in">
                🎉 Congratulations! 🎉
              </h1>
              
              <div className="bg-success/10 border border-success/20 rounded-xl p-6">
                <p className="text-xl text-foreground font-semibold mb-2">
                  Your {platform} account is eligible for
                </p>
                <p className="text-2xl font-bold gradient-earnings bg-clip-text text-transparent">
                  Monetization with International Ads Agency
                </p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Daily Returns</p>
                <p className="text-xs text-muted-foreground">Up to 9.1%</p>
              </div>
              
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Automated Ads</p>
                <p className="text-xs text-muted-foreground">100% Hands-free</p>
              </div>
              
              <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                <Star className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Premium Agency</p>
                <p className="text-xs text-muted-foreground">Global Reach</p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your {platform} account has been verified and connected successfully. 
                You can now start booking slots with premium advertising agencies.
              </p>
              
              <Button 
                onClick={handleContinue}
                className="gradient-primary glow-primary text-white px-8 py-3 text-lg font-semibold hover:opacity-90 transition-all animate-pulse"
              >
                Start Earning Now! 
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CongratulationEffect;