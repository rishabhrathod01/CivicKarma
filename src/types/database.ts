import type { ComplaintStatus, ContractorInfo, Department } from './complaints';
import type { PointAction } from './points';

// ─── Supabase Database Type Definitions ──────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          ward: string | null;
          points: number;
          total_reports: number;
          avatar_url: string | null;
          device_id: string | null;
          daily_report_count: number;
          last_report_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          phone?: string | null;
          ward?: string | null;
          points?: number;
          total_reports?: number;
          avatar_url?: string | null;
          device_id?: string | null;
          daily_report_count?: number;
          last_report_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string | null;
          ward?: string | null;
          points?: number;
          total_reports?: number;
          avatar_url?: string | null;
          device_id?: string | null;
          daily_report_count?: number;
          last_report_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          name_kn: string;
          department: string;
          icon: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_kn: string;
          department: string;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_kn?: string;
          department?: string;
          icon?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          name_kn: string;
          display_order: number;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          name_kn: string;
          display_order?: number;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          name_kn?: string;
          display_order?: number;
        };
      };
      complaints: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          subcategory_id: string | null;
          description: string;
          latitude: number;
          longitude: number;
          address: string | null;
          status: ComplaintStatus;
          department: Department;
          contractor_info: ContractorInfo | null;
          points_awarded: number;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          subcategory_id?: string | null;
          description: string;
          latitude: number;
          longitude: number;
          address?: string | null;
          status?: ComplaintStatus;
          department: Department;
          contractor_info?: ContractorInfo | null;
          points_awarded?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          subcategory_id?: string | null;
          description?: string;
          latitude?: number;
          longitude?: number;
          address?: string | null;
          status?: ComplaintStatus;
          department?: Department;
          contractor_info?: ContractorInfo | null;
          points_awarded?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      complaint_photos: {
        Row: {
          id: string;
          complaint_id: string;
          photo_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          photo_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          photo_url?: string;
          created_at?: string;
        };
      };
      points_log: {
        Row: {
          id: string;
          user_id: string;
          complaint_id: string | null;
          action: PointAction;
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          complaint_id?: string | null;
          action: PointAction;
          points: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          complaint_id?: string | null;
          action?: PointAction;
          points?: number;
          created_at?: string;
        };
      };
      complaint_status_history: {
        Row: {
          id: string;
          complaint_id: string;
          old_status: ComplaintStatus | null;
          new_status: ComplaintStatus;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          old_status?: ComplaintStatus | null;
          new_status: ComplaintStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          old_status?: ComplaintStatus | null;
          new_status?: ComplaintStatus;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      complaint_status: ComplaintStatus;
      department: Department;
      point_action: PointAction;
    };
  };
}

// ─── Type Helpers ────────────────────────────────────────────────────────────

type PublicSchema = Database['public'];

/** Extract the Row type for a given table name. */
export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row'];

/** Extract the Insert type for a given table name. */
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert'];

/** Extract the Update type for a given table name. */
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update'];
