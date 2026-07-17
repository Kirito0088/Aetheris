/**
 * Aetheris Supabase Database Types
 *
 * Mirrors `supabase/migrations/0001_initial_schema.sql` exactly, in the shape
 * emitted by `supabase gen types typescript`.
 *
 * ⚠ TEMPORARY HAND-WRITTEN TYPES — once the Supabase project is provisioned,
 * regenerate and overwrite this file (Phase 3.1, step 4):
 *
 *   supabase gen types typescript --project-id <ref> > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      zones: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          crowd_density: Database["public"]["Enums"]["crowd_density"];
          throughput: number;
          capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          crowd_density?: Database["public"]["Enums"]["crowd_density"];
          throughput?: number;
          capacity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          crowd_density?: Database["public"]["Enums"]["crowd_density"];
          throughput?: number;
          capacity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          user_id: string;
          match_name: string;
          match_date: string;
          kickoff_time: string;
          gate: string;
          sector: string;
          row: string;
          seat: string;
          status: Database["public"]["Enums"]["ticket_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          match_name: string;
          match_date: string;
          kickoff_time: string;
          gate: string;
          sector: string;
          row: string;
          seat: string;
          status?: Database["public"]["Enums"]["ticket_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          match_name?: string;
          match_date?: string;
          kickoff_time?: string;
          gate?: string;
          sector?: string;
          row?: string;
          seat?: string;
          status?: Database["public"]["Enums"]["ticket_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      incidents: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: Database["public"]["Enums"]["incident_status"];
          priority: Database["public"]["Enums"]["priority_level"];
          location_zone_id: string;
          reported_by: string | null;
          reported_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status?: Database["public"]["Enums"]["incident_status"];
          priority?: Database["public"]["Enums"]["priority_level"];
          location_zone_id: string;
          reported_by?: string | null;
          reported_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: Database["public"]["Enums"]["incident_status"];
          priority?: Database["public"]["Enums"]["priority_level"];
          location_zone_id?: string;
          reported_by?: string | null;
          reported_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "incidents_location_zone_id_fkey";
            columns: ["location_zone_id"];
            isOneToOne: false;
            referencedRelation: "zones";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "incidents_reported_by_fkey";
            columns: ["reported_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: Database["public"]["Enums"]["task_type"];
          priority: Database["public"]["Enums"]["priority_level"];
          status: Database["public"]["Enums"]["task_status"];
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type: Database["public"]["Enums"]["task_type"];
          priority?: Database["public"]["Enums"]["priority_level"];
          status?: Database["public"]["Enums"]["task_status"];
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: Database["public"]["Enums"]["task_type"];
          priority?: Database["public"]["Enums"]["priority_level"];
          status?: Database["public"]["Enums"]["task_status"];
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: Database["public"]["Enums"]["alert_type"];
          action_label: string | null;
          target_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type: Database["public"]["Enums"]["alert_type"];
          action_label?: string | null;
          target_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: Database["public"]["Enums"]["alert_type"];
          action_label?: string | null;
          target_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alerts_target_user_id_fkey";
            columns: ["target_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      priority_level: "high" | "medium" | "low";
      crowd_density: "low" | "medium" | "high" | "critical";
      ticket_status: "valid" | "scanned";
      incident_status: "open" | "assigned" | "resolved";
      task_type: "incident" | "assistance" | "logistics";
      task_status: "pending" | "active" | "completed";
      alert_type: "routing" | "info" | "urgent";
      user_role: "fan" | "volunteer" | "venue_operator";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// =============================================================================
// CONVENIENCE HELPERS (same helpers `supabase gen types` emits)
// =============================================================================

type PublicSchema = Database["public"];

/** Row type for a table: `Tables<'zones'>` */
export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

/** Insert payload for a table: `TablesInsert<'incidents'>` */
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

/** Update payload for a table: `TablesUpdate<'tasks'>` */
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

/** Enum type: `Enums<'user_role'>` */
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];
