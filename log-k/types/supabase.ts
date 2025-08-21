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
          flight_date: string
          departure_airport: string
          arrival_airport: string
          off_block: string | null
          takeoff: string | null
          landing: string | null
          on_block: string | null
          aircraft_id: string | null
          aircraft_type: string
          registration: string
          flight_number: string | null
          pic_time: number | null
          sic_time: number | null
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
      flight_roles: {
        Row: {
          id: string
          flight_id: string
          crew_member_id: string
          role_name: string
          user_id: string
          deleted: boolean
          deleted_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['flight_roles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['flight_roles']['Insert']>
      }
      aircrafts: {
        Row: {
          id: string
          user_id: string
          registration: string
          aircraft_type: string
          serial_number: string | null
          engine_type: string | null
          first_flight: string | null
          aircraft_class: 'SEP' | 'MEP' | 'SET' | 'MET' | null
          default_condition: 'VFR' | 'IFR' | null
          complex_aircraft: boolean
          high_performance: boolean
          tailwheel: boolean
          glass_panel: boolean
          economy_seats: number | null
          premium_economy_seats: number | null
          business_seats: number | null
          first_class_seats: number | null
          deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['aircrafts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['aircrafts']['Insert']>
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