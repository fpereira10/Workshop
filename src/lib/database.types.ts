// GERADO a partir do banco (projeto Workshop). Não edite à mão.
// Para atualizar depois de mudar o schema, peça para regerar os tipos (generate_typescript_types).
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ideas: {
        Row: {
          audio_path: string | null
          body: string | null
          created_at: string
          duration_sec: number | null
          id: string
          title: string
          track_id: string | null
          type: Database["public"]["Enums"]["idea_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_path?: string | null
          body?: string | null
          created_at?: string
          duration_sec?: number | null
          id?: string
          title: string
          track_id?: string | null
          type: Database["public"]["Enums"]["idea_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_path?: string | null
          body?: string | null
          created_at?: string
          duration_sec?: number | null
          id?: string
          title?: string
          track_id?: string | null
          type?: Database["public"]["Enums"]["idea_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_track_fkey"
            columns: ["track_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      melodies: {
        Row: {
          audio_path: string
          bpm: number
          created_at: string
          id: string
          midi_path: string | null
          notes: Json
          quantize: string
          title: string
          track_id: string | null
          transpose: number
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_path: string
          bpm: number
          created_at?: string
          id?: string
          midi_path?: string | null
          notes?: Json
          quantize?: string
          title: string
          track_id?: string | null
          transpose?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_path?: string
          bpm?: number
          created_at?: string
          id?: string
          midi_path?: string | null
          notes?: Json
          quantize?: string
          title?: string
          track_id?: string | null
          transpose?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "melodies_track_fkey"
            columns: ["track_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          focus_track_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          focus_track_id?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          focus_track_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_focus_track_fkey"
            columns: ["focus_track_id", "id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          day: string
          id: string
          source: Database["public"]["Enums"]["session_source"]
          track_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          source?: Database["public"]["Enums"]["session_source"]
          track_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          source?: Database["public"]["Enums"]["session_source"]
          track_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_track_fkey"
            columns: ["track_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      suggestions: {
        Row: {
          created_at: string
          id: string
          resolved_at: string | null
          source_idea_id: string | null
          state: Database["public"]["Enums"]["suggestion_state"]
          text: string
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resolved_at?: string | null
          source_idea_id?: string | null
          state?: Database["public"]["Enums"]["suggestion_state"]
          text: string
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resolved_at?: string | null
          source_idea_id?: string | null
          state?: Database["public"]["Enums"]["suggestion_state"]
          text?: string
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_source_idea_fkey"
            columns: ["source_idea_id", "user_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "suggestions_track_fkey"
            columns: ["track_id", "user_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      tracks: {
        Row: {
          bpm: number
          created_at: string
          energy: Database["public"]["Enums"]["energy"]
          id: string
          last_activity_at: string
          musical_key: string | null
          name: string
          next_step: string | null
          status: Database["public"]["Enums"]["track_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bpm: number
          created_at?: string
          energy?: Database["public"]["Enums"]["energy"]
          id?: string
          last_activity_at?: string
          musical_key?: string | null
          name: string
          next_step?: string | null
          status?: Database["public"]["Enums"]["track_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bpm?: number
          created_at?: string
          energy?: Database["public"]["Enums"]["energy"]
          id?: string
          last_activity_at?: string
          musical_key?: string | null
          name?: string
          next_step?: string | null
          status?: Database["public"]["Enums"]["track_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transcriptions: {
        Row: {
          created_at: string
          edited: boolean
          id: string
          idea_id: string
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          edited?: boolean
          id?: string
          idea_id: string
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          edited?: boolean
          id?: string
          idea_id?: string
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transcriptions_idea_fkey"
            columns: ["idea_id", "user_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      energy: "calma" | "melancolica" | "hipnotica" | "intensa" | "solar"
      idea_type: "memo" | "nota"
      session_source: "auto" | "manual"
      suggestion_state: "pendente" | "aceita" | "descartada"
      track_status: "ideia" | "arranjo" | "mix" | "master" | "pronta"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      energy: ["calma", "melancolica", "hipnotica", "intensa", "solar"],
      idea_type: ["memo", "nota"],
      session_source: ["auto", "manual"],
      suggestion_state: ["pendente", "aceita", "descartada"],
      track_status: ["ideia", "arranjo", "mix", "master", "pronta"],
    },
  },
} as const
