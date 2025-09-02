import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, Zap, Star, Users, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/coinzy-hero.jpg';
import fitnessCategory from '@/assets/fitness-category.jpg';
import beautyCategory from '@/assets/beauty-category.jpg';
import techCategory from '@/assets/tech-category.jpg';

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      // If user is already authenticated, redirect to dashboard
      if (session) {
        navigate('/dashboard');
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        if (session) {
          navigate('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-2xl font-bold text-primary">Coinzy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-foreground hover:text-primary">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" className="gradient-primary glow-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  Choose. Book.{' '}
                  <span className="gradient-primary bg-clip-text text-transparent">
                    Earn Daily.
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Partner with international ad agencies and earn consistent daily returns. 
                  Book your slots in high-performing categories and watch your earnings grow.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  variant="hero" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  Start Earning Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Verified Agencies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Daily Payouts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Secure Platform</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-primary opacity-20 rounded-xl blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="Coinzy Platform" 
                className="relative z-10 w-full rounded-xl shadow-premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">How Coinzy Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start earning with international ad agencies
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Agency',
                description: 'Browse verified international ad agencies by category and performance ratings.',
                icon: <Users className="w-6 h-6" />
              },
              {
                step: '02',
                title: 'Book Slot',
                description: 'Select your preferred agency and book available slots with flexible investment amounts.',
                icon: <Zap className="w-6 h-6" />
              },
              {
                step: '03',
                title: 'Earn Daily',
                description: 'Receive daily returns based on agency performance and category success rates.',
                icon: <TrendingUp className="w-6 h-6" />
              }
            ].map((item, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-card-hover transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Top Performing Categories</h2>
            <p className="text-xl text-muted-foreground">Higher performing categories show better returns</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Fitness & Health',
                return: '8.2%',
                image: fitnessCategory,
                agencies: 24,
                trend: '+2.1%'
              },
              {
                name: 'Beauty & Lifestyle',
                return: '7.8%',
                image: beautyCategory,
                agencies: 18,
                trend: '+1.8%'
              },
              {
                name: 'Tech & Innovation',
                return: '9.1%',
                image: techCategory,
                agencies: 31,
                trend: '+3.2%'
              }
            ].map((category, index) => (
              <Card key={index} className="group hover:shadow-premium transition-all duration-300 cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {category.trend}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-success">{category.return}</span>
                      <span className="text-sm text-muted-foreground">{category.agencies} agencies</span>
                    </div>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      View Agencies
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already earning daily returns with verified international ad agencies.
          </p>
          <Button 
            onClick={handleGetStarted}
            variant="secondary" 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 gradient-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-lg font-bold text-primary">Coinzy</span>
          </div>
          <p className="text-center text-muted-foreground">
            © 2024 Coinzy. Empowering users to earn with international ad agencies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;