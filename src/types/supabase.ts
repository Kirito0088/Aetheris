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
      alerts: {
        Row: {
          action_label: string | null
          created_at: string | null
          description: string
          id: string
          target_user_id: string | null
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at: string | null
        }
        Insert: {
          action_label?: string | null
          created_at?: string | null
          description: string
          id?: string
          target_user_id?: string | null
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          updated_at?: string | null
        }
        Update: {
          action_label?: string | null
          created_at?: string | null
          description?: string
          id?: string
          target_user_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          description: string
          id: string
          location_zone_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          reported_at: string
          reported_by: string | null
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string
        }
        Insert: {
          description: string
          id?: string
          location_zone_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          reported_at?: string
          reported_by?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string
        }
        Update: {
          description?: string
          id?: string
          location_zone_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          reported_at?: string
          reported_by?: string | null
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_location_zone_id_fkey"
            columns: ["location_zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string | null
          gate: string
          id: string
          kickoff_time: string
          match_date: string
          match_name: string
          row: string
          seat: string
          sector: string
          status: Database["public"]["Enums"]["ticket_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          gate: string
          id?: string
          kickoff_time: string
          match_date: string
          match_name: string
          row: string
          seat: string
          sector: string
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          gate?: string
          id?: string
          kickoff_time?: string
          match_date?: string
          match_name?: string
          row?: string
          seat?: string
          sector?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_status: {
        Row: {
          ai_recommended: boolean
          assignment: string | null
          battery: number
          current_zone_id: string | null
          id: string
          last_active: string
          radio_channel: string | null
          rec_reason: string | null
          status: string
          workload: string
        }
        Insert: {
          ai_recommended?: boolean
          assignment?: string | null
          battery?: number
          current_zone_id?: string | null
          id: string
          last_active?: string
          radio_channel?: string | null
          rec_reason?: string | null
          status?: string
          workload?: string
        }
        Update: {
          ai_recommended?: boolean
          assignment?: string | null
          battery?: number
          current_zone_id?: string | null
          id?: string
          last_active?: string
          radio_channel?: string | null
          rec_reason?: string | null
          status?: string
          workload?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_status_current_zone_id_fkey"
            columns: ["current_zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_status_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          capacity: number
          created_at: string | null
          crowd_density: Database["public"]["Enums"]["crowd_density"]
          description: string | null
          id: string
          name: string
          throughput: number
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          crowd_density?: Database["public"]["Enums"]["crowd_density"]
          description?: string | null
          id: string
          name: string
          throughput?: number
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          crowd_density?: Database["public"]["Enums"]["crowd_density"]
          description?: string | null
          id?: string
          name?: string
          throughput?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_type: "routing" | "info" | "urgent"
      crowd_density: "low" | "medium" | "high" | "critical"
      incident_status: "open" | "assigned" | "resolved"
      priority_level: "high" | "medium" | "low"
      task_status: "pending" | "active" | "completed"
      task_type: "incident" | "assistance" | "logistics"
      ticket_status: "valid" | "scanned"
      user_role: "fan" | "volunteer" | "venue_operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
