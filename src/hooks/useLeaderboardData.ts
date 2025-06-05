
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry } from '@/types/leaderboard';

export const useLeaderboardData = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('arc_agi_1', { ascending: false, nullsFirst: false });
      
      if (error) {
        console.error('Error fetching leaderboard data:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};
