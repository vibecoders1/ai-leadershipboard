export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          admin_id: string
          bearer_token: string
          client_id: string
          client_name: string
          client_secret: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          admin_id: string
          bearer_token: string
          client_id: string
          client_name: string
          client_secret: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          admin_id?: string
          bearer_token?: string
          client_id?: string
          client_name?: string
          client_secret?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      api_usage_logs: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          id: string
          method: string
          request_data: Json | null
          response_status: number | null
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          id?: string
          method: string
          request_data?: Json | null
          response_status?: number | null
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          method?: string
          request_data?: Json | null
          response_status?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          ai_system: string
          arc_agi_1: number | null
          arc_agi_2: number | null
          code_paper_link: string | null
          cost_per_task: number | null
          created_at: string
          id: string
          organization: string
          system_type: string
          updated_at: string
        }
        Insert: {
          ai_system: string
          arc_agi_1?: number | null
          arc_agi_2?: number | null
          code_paper_link?: string | null
          cost_per_task?: number | null
          created_at?: string
          id?: string
          organization: string
          system_type: string
          updated_at?: string
        }
        Update: {
          ai_system?: string
          arc_agi_1?: number | null
          arc_agi_2?: number | null
          code_paper_link?: string | null
          cost_per_task?: number | null
          created_at?: string
          id?: string
          organization?: string
          system_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      model_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          category_id: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscriptions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "model_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_requests: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          admin_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          user_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          user_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          category_name: string | null
          created_at: string
          id: string
          model_id: string
          user_id: string
        }
        Insert: {
          category_name?: string | null
          created_at?: string
          id?: string
          model_id: string
          user_id: string
        }
        Update: {
          category_name?: string | null
          created_at?: string
          id?: string
          model_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "leaderboard_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_model_selections: {
        Row: {
          ai_system: string
          arc_agi_1: number | null
          arc_agi_2: number | null
          code_paper_link: string | null
          cost_per_task: number | null
          created_at: string
          id: string
          is_default: boolean
          organization: string
          system_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_system: string
          arc_agi_1?: number | null
          arc_agi_2?: number | null
          code_paper_link?: string | null
          cost_per_task?: number | null
          created_at?: string
          id?: string
          is_default?: boolean
          organization: string
          system_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_system?: string
          arc_agi_1?: number | null
          arc_agi_2?: number | null
          code_paper_link?: string | null
          cost_per_task?: number | null
          created_at?: string
          id?: string
          is_default?: boolean
          organization?: string
          system_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_bearer_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      insert_default_models_for_user: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      validate_api_key: {
        Args: { token: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
