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
      addresses: {
        Row: {
          address: string
          city: string
          created_at: string
          id: string
          is_default: boolean
          state: string
          updated_at: string
          user_id: string
          zipcode: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          id?: string
          is_default?: boolean
          state: string
          updated_at?: string
          user_id: string
          zipcode: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          state?: string
          updated_at?: string
          user_id?: string
          zipcode?: string
        }
        Relationships: []
      }
      admin_dashboard_orders: {
        Row: {
          created_at: string
          customer_address: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          items: Json | null
          order_id: string
          order_number: string | null
          payment_method: string | null
          status: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json | null
          order_id: string
          order_number?: string | null
          payment_method?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_address?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json | null
          order_id?: string
          order_number?: string | null
          payment_method?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ambulances: {
        Row: {
          created_at: string
          driver_name: string
          driver_phone: string
          id: string
          last_latitude: number | null
          last_longitude: number | null
          last_updated: string | null
          name: string
          status: string
          updated_at: string
          vehicle_number: string
        }
        Insert: {
          created_at?: string
          driver_name: string
          driver_phone: string
          id?: string
          last_latitude?: number | null
          last_longitude?: number | null
          last_updated?: string | null
          name: string
          status?: string
          updated_at?: string
          vehicle_number: string
        }
        Update: {
          created_at?: string
          driver_name?: string
          driver_phone?: string
          id?: string
          last_latitude?: number | null
          last_longitude?: number | null
          last_updated?: string | null
          name?: string
          status?: string
          updated_at?: string
          vehicle_number?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctor_consultations: {
        Row: {
          consultation_type: string
          created_at: string
          doctor_id: string
          ended_at: string | null
          id: string
          room_name: string
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_type: string
          created_at?: string
          doctor_id: string
          ended_at?: string | null
          id?: string
          room_name: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_type?: string
          created_at?: string
          doctor_id?: string
          ended_at?: string | null
          id?: string
          room_name?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_requests: {
        Row: {
          ambulance_id: string | null
          created_at: string
          id: string
          location: Json
          name: string
          notes: string | null
          phone: string
          status: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          ambulance_id?: string | null
          created_at?: string
          id?: string
          location: Json
          name: string
          notes?: string | null
          phone: string
          status?: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          ambulance_id?: string | null
          created_at?: string
          id?: string
          location?: Json
          name?: string
          notes?: string | null
          phone?: string
          status?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_requests_ambulance_id_fkey"
            columns: ["ambulance_id"]
            isOneToOne: false
            referencedRelation: "ambulances"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tracking_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_new"
            referencedColumns: ["order_id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          assigned_rider_id: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          delivery_location: string | null
          earning: number | null
          id: string
          items: Json | null
          order_id: string
          pickup_location: string | null
          prescription_image_url: string | null
          rider_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          assigned_rider_id?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_location?: string | null
          earning?: number | null
          id?: string
          items?: Json | null
          order_id: string
          pickup_location?: string | null
          prescription_image_url?: string | null
          rider_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          assigned_rider_id?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          delivery_location?: string | null
          earning?: number | null
          id?: string
          items?: Json | null
          order_id?: string
          pickup_location?: string | null
          prescription_image_url?: string | null
          rider_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_assigned_rider_id_fkey"
            columns: ["assigned_rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_new"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_new: {
        Row: {
          action: string | null
          amount: number
          created_at: string
          customer: string
          date: string
          delivery_address: string | null
          id: string
          items: Json | null
          order_id: string
          prescription_url: string | null
          setup_prescription: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          amount: number
          created_at?: string
          customer: string
          date?: string
          delivery_address?: string | null
          id?: string
          items?: Json | null
          order_id: string
          prescription_url?: string | null
          setup_prescription?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          amount?: number
          created_at?: string
          customer?: string
          date?: string
          delivery_address?: string | null
          id?: string
          items?: Json | null
          order_id?: string
          prescription_url?: string | null
          setup_prescription?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_new_delivery_address_fkey"
            columns: ["delivery_address"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          created_at: string
          emergency_contact: string | null
          id: string
          medical_notes: string | null
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          medical_notes?: string | null
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          medical_notes?: string | null
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          discount_price: number | null
          id: string
          image_url: string | null
          name: string
          prescription_required: boolean | null
          price: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          id?: string
          image_url?: string | null
          name: string
          prescription_required?: boolean | null
          price: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          id?: string
          image_url?: string | null
          name?: string
          prescription_required?: boolean | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          ambulance_id: string | null
          created_at: string
          description: string | null
          emergency_id: string | null
          id: string
          report_date: string
          title: string
          updated_at: string
        }
        Insert: {
          ambulance_id?: string | null
          created_at?: string
          description?: string | null
          emergency_id?: string | null
          id?: string
          report_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          ambulance_id?: string | null
          created_at?: string
          description?: string | null
          emergency_id?: string | null
          id?: string
          report_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_ambulance_id_fkey"
            columns: ["ambulance_id"]
            isOneToOne: false
            referencedRelation: "ambulances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_emergency_id_fkey"
            columns: ["emergency_id"]
            isOneToOne: false
            referencedRelation: "emergency_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          aadhaar_url: string | null
          created_at: string
          current_location: string | null
          email: string
          id: string
          is_online: boolean | null
          kyc_verified: boolean | null
          license_url: string | null
          name: string
          pan_url: string | null
          phone: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          aadhaar_url?: string | null
          created_at?: string
          current_location?: string | null
          email: string
          id?: string
          is_online?: boolean | null
          kyc_verified?: boolean | null
          license_url?: string | null
          name: string
          pan_url?: string | null
          phone: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          aadhaar_url?: string | null
          created_at?: string
          current_location?: string | null
          email?: string
          id?: string
          is_online?: boolean | null
          kyc_verified?: boolean | null
          license_url?: string | null
          name?: string
          pan_url?: string | null
          phone?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_agora_token: {
        Args: { p_channel_name: string; p_uid: string; p_role: string }
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
