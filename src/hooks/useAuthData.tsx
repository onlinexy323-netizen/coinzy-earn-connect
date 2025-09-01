import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  referralCode?: string;
}

export const useAuthData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        extractUserData(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          extractUserData(session.user);
        } else {
          setUserData(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const extractUserData = (authUser: User) => {
    // Extract data from Google auth or custom signup
    const userData: UserData = {
      name: authUser.user_metadata?.full_name || 
            authUser.user_metadata?.name || 
            authUser.email?.split('@')[0] || 
            'User',
      email: authUser.email || '',
      avatar: authUser.user_metadata?.avatar_url || 
              authUser.user_metadata?.picture,
      referralCode: authUser.user_metadata?.referral_code
    };
    
    setUserData(userData);
  };

  const getUserDisplayName = () => {
    return userData?.name || 'User';
  };

  const getUserEmail = () => {
    return userData?.email || '';
  };

  const getUserAvatar = () => {
    return userData?.avatar;
  };

  const getReferralCode = () => {
    return userData?.referralCode;
  };

  return {
    user,
    userData,
    loading,
    getUserDisplayName,
    getUserEmail,
    getUserAvatar,
    getReferralCode
  };
};