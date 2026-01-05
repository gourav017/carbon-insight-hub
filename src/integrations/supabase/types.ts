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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          industry: string | null
          size: string | null
          region: string | null
          website: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          size?: string | null
          region?: string | null
          website?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          size?: string | null
          region?: string | null
          website?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      esg_assessments: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          status: string | null
          reporting_year: number | null
          overall_score: number | null
          environmental_score: number | null
          social_score: number | null
          governance_score: number | null
          answers: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          status?: string | null
          reporting_year?: number | null
          overall_score?: number | null
          environmental_score?: number | null
          social_score?: number | null
          governance_score?: number | null
          answers?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          status?: string | null
          reporting_year?: number | null
          overall_score?: number | null
          environmental_score?: number | null
          social_score?: number | null
          governance_score?: number | null
          answers?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      carbon_emissions: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          status: string | null
          reporting_year: number | null
          total_emissions: number | null
          scope1_total: number | null
          scope2_total: number | null
          scope3_total: number | null
          scope1_data: Json | null
          scope2_data: Json | null
          scope3_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          status?: string | null
          reporting_year?: number | null
          total_emissions?: number | null
          scope1_total?: number | null
          scope2_total?: number | null
          scope3_total?: number | null
          scope1_data?: Json | null
          scope2_data?: Json | null
          scope3_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          status?: string | null
          reporting_year?: number | null
          total_emissions?: number | null
          scope1_total?: number | null
          scope2_total?: number | null
          scope3_total?: number | null
          scope1_data?: Json | null
          scope2_data?: Json | null
          scope3_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      carbon_footprints: {
        Row: {
          id: string
          organization_id: string | null
          user_id: string | null
          sector_id: string
          status: string | null
          total_emissions: number | null
          breakdown: Json | null
          input_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          sector_id: string
          status?: string | null
          total_emissions?: number | null
          breakdown?: Json | null
          input_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          user_id?: string | null
          sector_id?: string
          status?: string | null
          total_emissions?: number | null
          breakdown?: Json | null
          input_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
