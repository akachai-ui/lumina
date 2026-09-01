export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string;
          name: string;
          owner_id: string | null;
          created_at: string | null;
          terms_accepted_at: string | null;
          logo_url: string | null;
          phone: string | null;
          address: string | null;
          slug: string | null;
          plan_tier: string | null;
          plan_status: string | null;
          plan_expires_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id?: string | null;
          created_at?: string | null;
          terms_accepted_at?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          address?: string | null;
          slug?: string | null;
          plan_tier?: string | null;
          plan_status?: string | null;
          plan_expires_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string | null;
          created_at?: string | null;
          terms_accepted_at?: string | null;
          logo_url?: string | null;
          phone?: string | null;
          address?: string | null;
          slug?: string | null;
          plan_tier?: string | null;
          plan_status?: string | null;
          plan_expires_at?: string | null;
        };
      };
      staff: {
        Row: {
          id: string;
          name: string;
          is_active: boolean | null;
          created_at: string;
          image_url: string | null;
          wage_type: string | null;
          wage_amount: number | null;
          commission_percent: number | null;
          start_date: string | null;
          note: string | null;
          shop_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          is_active?: boolean | null;
          created_at?: string;
          image_url?: string | null;
          wage_type?: string | null;
          wage_amount?: number | null;
          commission_percent?: number | null;
          start_date?: string | null;
          note?: string | null;
          shop_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          is_active?: boolean | null;
          created_at?: string;
          image_url?: string | null;
          wage_type?: string | null;
          wage_amount?: number | null;
          commission_percent?: number | null;
          start_date?: string | null;
          note?: string | null;
          shop_id?: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          price: number;
          created_at: string | null;
          shop_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          created_at?: string | null;
          shop_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          created_at?: string | null;
          shop_id?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          staff_id: string | null;
          customer_name: string | null;
          amount: number;
          created_at: string;
          service_name: string | null;
          shop_id: string | null;
          payment_method: string;
        };
        Insert: {
          id?: string;
          staff_id?: string | null;
          customer_name?: string | null;
          amount: number;
          created_at?: string;
          service_name?: string | null;
          shop_id?: string | null;
          payment_method: string;
        };
        Update: {
          id?: string;
          staff_id?: string | null;
          customer_name?: string | null;
          amount?: number;
          created_at?: string;
          service_name?: string | null;
          shop_id?: string | null;
          payment_method?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          shop_id: string;
          staff_id: string;
          customer_name: string;
          customer_phone: string | null;
          appointment_date: string;
          appointment_time: string;
          service_name: string | null;
          status: string | null;
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          shop_id: string;
          staff_id: string;
          customer_name: string;
          customer_phone?: string | null;
          appointment_date: string;
          appointment_time: string;
          service_name?: string | null;
          status?: string | null;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          shop_id?: string;
          staff_id?: string;
          customer_name?: string;
          customer_phone?: string | null;
          appointment_date?: string;
          appointment_time?: string;
          service_name?: string | null;
          status?: string | null;
          notes?: string | null;
          created_at?: string | null;
        };
      };
      expenses: {
        Row: {
          id: string;
          shop_id: string;
          amount: number;
          category: string;
          description: string | null;
          expense_date: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          shop_id: string;
          amount: number;
          category: string;
          description?: string | null;
          expense_date: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          shop_id?: string;
          amount?: number;
          category?: string;
          description?: string | null;
          expense_date?: string;
          created_at?: string | null;
        };
      };
      payment_slips: {
        Row: {
          id: string;
          shop_id: string | null;
          amount: number;
          plan_tier: string;
          months: number;
          slip_url: string;
          status: string | null;
          created_at: string | null;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          shop_id?: string | null;
          amount: number;
          plan_tier: string;
          months: number;
          slip_url: string;
          status?: string | null;
          created_at?: string | null;
          approved_at?: string | null;
        };
        Update: {
          id?: string;
          shop_id?: string | null;
          amount?: number;
          plan_tier?: string;
          months?: number;
          slip_url?: string;
          status?: string | null;
          created_at?: string | null;
          approved_at?: string | null;
        };
      };
    };
  };
}

// Convenience Type Aliases
export type Shop = Database["public"]["Tables"]["shops"]["Row"];
export type Staff = Database["public"]["Tables"]["staff"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type PaymentSlip = Database["public"]["Tables"]["payment_slips"]["Row"];
