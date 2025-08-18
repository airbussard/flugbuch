export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flights: {
        Row: {
          id: string
          user_id: string
          date: string
          departure_airport: string | null
          arrival_airport: string | null
          departure_time: string | null
          arrival_time: string | null
          aircraft_id: string | null
          aircraft_type: string | null
          aircraft_registration: string | null
          pic_name: string | null
          flight_time: number | null
          block_time: number | null
          night_time: number | null
          ifr_time: number | null
          vfr_time: number | null
          multi_pilot_time: number | null
          cross_country_time: number | null
          dual_given_time: number | null
          dual_received_time: number | null
          landings_day: number | null
          landings_night: number | null
          remarks: string | null
          deleted: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['flights']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['flights']['Insert']>
      }
      aircraft: {
        Row: {
          id: string
          user_id: string
          registration: string
          type: string
          manufacturer: string | null
          model: string | null
          year: number | null
          engine_type: string | null
          is_complex: boolean
          is_high_performance: boolean
          is_tailwheel: boolean
          is_glass_cockpit: boolean
          deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['aircraft']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['aircraft']['Insert']>
      }
      crew_members: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          license_number: string | null
          role: string | null
          deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['crew_members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['crew_members']['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          license_number: string | null
          license_type: string | null
          medical_expiry: string | null
          total_hours: number | null
          compliance_mode: 'EASA' | 'FAA' | 'NONE'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
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
  }
}