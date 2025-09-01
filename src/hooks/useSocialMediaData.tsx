import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SocialMediaAccount {
  id: string;
  platform: string;
  account_handle: string;
  display_name: string;
  follower_count: number;
  profile_image_url?: string;
  is_verified: boolean;
  connected_at: string;
}

export const useSocialMediaData = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [primaryAccount, setPrimaryAccount] = useState<SocialMediaAccount | null>(null);

  useEffect(() => {
    fetchSocialAccounts();
  }, []);

  const fetchSocialAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('social_media_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('connected_at', { ascending: false });

      if (error) throw error;

      setSocialAccounts(data || []);
      // Set the most recently connected account as primary
      setPrimaryAccount(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching social accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    return primaryAccount?.display_name || 'User';
  };

  const getUserAvatar = () => {
    return primaryAccount?.profile_image_url || undefined;
  };

  const getConnectedPlatforms = () => {
    return socialAccounts.map(account => account.platform);
  };

  const getTotalFollowers = () => {
    return socialAccounts.reduce((total, account) => total + account.follower_count, 0);
  };

  const getAccountByPlatform = (platform: string) => {
    return socialAccounts.find(account => account.platform === platform);
  };

  return {
    socialAccounts,
    loading,
    primaryAccount,
    getUserDisplayName,
    getUserAvatar,
    getConnectedPlatforms,
    getTotalFollowers,
    getAccountByPlatform,
    refreshAccounts: fetchSocialAccounts
  };
};