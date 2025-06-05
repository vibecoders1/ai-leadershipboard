
export interface LeaderboardEntry {
  id: string;
  ai_system: string;
  organization: string;
  system_type: string;
  arc_agi_1: number | null;
  arc_agi_2: number | null;
  cost_per_task: number;
  code_paper_link: string | null;
  created_at?: string;
  updated_at?: string;
}
