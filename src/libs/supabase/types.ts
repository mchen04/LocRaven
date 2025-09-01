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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      business_usage_tracking: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          updates_limit: number
          updates_used: number
          usage_period_end: string
          usage_period_start: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          updates_limit: number
          updates_used?: number
          usage_period_end: string
          usage_period_start: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          updates_limit?: number
          updates_used?: number
          usage_period_end?: string
          usage_period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_usage_tracking_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          accessibility_features: string[] | null
          address_city: string | null
          address_state: string | null
          address_street: string | null
          availability_policy: Json | null
          awards: Json | null
          business_faqs: Json | null
          certifications: Json | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          enhanced_parking_info: Json | null
          established_year: number | null
          featured_items: Json | null
          hours: string | null
          id: string
          languages_spoken: string[] | null
          latitude: number | null
          longitude: number | null
          name: string | null
          parking_info: string | null
          payment_methods: string[] | null
          phone: string | null
          phone_country_code: string | null
          price_positioning: string | null
          primary_category:
            | Database["public"]["Enums"]["primary_category"]
            | null
          review_summary: Json | null
          service_area: string | null
          service_area_details: Json | null
          services: Json | null
          slug: string | null
          social_media: Json | null
          specialties: Json | null
          static_tags: Database["public"]["Enums"]["static_tag"][] | null
          status_override: string | null
          structured_hours: Json | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          availability_policy?: Json | null
          awards?: Json | null
          business_faqs?: Json | null
          certifications?: Json | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          enhanced_parking_info?: Json | null
          established_year?: number | null
          featured_items?: Json | null
          hours?: string | null
          id?: string
          languages_spoken?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          parking_info?: string | null
          payment_methods?: string[] | null
          phone?: string | null
          phone_country_code?: string | null
          price_positioning?: string | null
          primary_category?:
            | Database["public"]["Enums"]["primary_category"]
            | null
          review_summary?: Json | null
          service_area?: string | null
          service_area_details?: Json | null
          services?: Json | null
          slug?: string | null
          social_media?: Json | null
          specialties?: Json | null
          static_tags?: Database["public"]["Enums"]["static_tag"][] | null
          status_override?: string | null
          structured_hours?: Json | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          address_city?: string | null
          address_state?: string | null
          address_street?: string | null
          availability_policy?: Json | null
          awards?: Json | null
          business_faqs?: Json | null
          certifications?: Json | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          enhanced_parking_info?: Json | null
          established_year?: number | null
          featured_items?: Json | null
          hours?: string | null
          id?: string
          languages_spoken?: string[] | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          parking_info?: string | null
          payment_methods?: string[] | null
          phone?: string | null
          phone_country_code?: string | null
          price_positioning?: string | null
          primary_category?:
            | Database["public"]["Enums"]["primary_category"]
            | null
          review_summary?: Json | null
          service_area?: string | null
          service_area_details?: Json | null
          services?: Json | null
          slug?: string | null
          social_media?: Json | null
          specialties?: Json | null
          static_tags?: Database["public"]["Enums"]["static_tag"][] | null
          status_override?: string | null
          structured_hours?: Json | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      cache_invalidation_queue: {
        Row: {
          cache_key: string
          created_at: string | null
          id: number
          invalidation_type: string
          processed_at: string | null
          status: string | null
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          id?: number
          invalidation_type: string
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          id?: number
          invalidation_type?: string
          processed_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      generated_pages: {
        Row: {
          ai_citation_score: number | null
          business_id: string
          content_intent: string | null
          created_at: string | null
          dynamic_tags: string[] | null
          expired: boolean | null
          expired_at: string | null
          expires_at: string | null
          file_path: string
          generation_batch_id: string | null
          html_content: string | null
          id: string
          intent_type: string | null
          last_status_calculation: string | null
          page_data: Json | null
          page_type: string | null
          page_variant: string | null
          published: boolean | null
          published_at: string | null
          rendered_size_kb: number | null
          slug: string | null
          tags_expire_at: string | null
          template_id: string | null
          title: string
          update_id: string
          updated_at: string | null
        }
        Insert: {
          ai_citation_score?: number | null
          business_id: string
          content_intent?: string | null
          created_at?: string | null
          dynamic_tags?: string[] | null
          expired?: boolean | null
          expired_at?: string | null
          expires_at?: string | null
          file_path: string
          generation_batch_id?: string | null
          html_content?: string | null
          id?: string
          intent_type?: string | null
          last_status_calculation?: string | null
          page_data?: Json | null
          page_type?: string | null
          page_variant?: string | null
          published?: boolean | null
          published_at?: string | null
          rendered_size_kb?: number | null
          slug?: string | null
          tags_expire_at?: string | null
          template_id?: string | null
          title: string
          update_id: string
          updated_at?: string | null
        }
        Update: {
          ai_citation_score?: number | null
          business_id?: string
          content_intent?: string | null
          created_at?: string | null
          dynamic_tags?: string[] | null
          expired?: boolean | null
          expired_at?: string | null
          expires_at?: string | null
          file_path?: string
          generation_batch_id?: string | null
          html_content?: string | null
          id?: string
          intent_type?: string | null
          last_status_calculation?: string | null
          page_data?: Json | null
          page_type?: string | null
          page_variant?: string | null
          published?: boolean | null
          published_at?: string | null
          rendered_size_kb?: number | null
          slug?: string | null
          tags_expire_at?: string | null
          template_id?: string | null
          title?: string
          update_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_pages_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_pages_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "updates"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean
          created: string
          currency: string
          id: string
          interval: string | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: string
          unit_amount: number | null
          updated: string
        }
        Insert: {
          active?: boolean
          created?: string
          currency?: string
          id: string
          interval?: string | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type: string
          unit_amount?: number | null
          updated?: string
        }
        Update: {
          active?: boolean
          created?: string
          currency?: string
          id?: string
          interval?: string | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: string
          unit_amount?: number | null
          updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          created: string
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
          updated: string
        }
        Insert: {
          active?: boolean
          created?: string
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
          updated?: string
        }
        Update: {
          active?: boolean
          created?: string
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
          updated?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string | null
          current_period_end: string | null
          current_period_start: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      updates: {
        Row: {
          ai_provider: string | null
          business_id: string
          content_text: string
          created_at: string | null
          deal_terms: string | null
          error_message: string | null
          expiration_date_time: string | null
          id: string
          processing_time_ms: number | null
          special_hours_today: Json | null
          status: string
          update_category: string | null
          update_faqs: Json | null
        }
        Insert: {
          ai_provider?: string | null
          business_id: string
          content_text: string
          created_at?: string | null
          deal_terms?: string | null
          error_message?: string | null
          expiration_date_time?: string | null
          id?: string
          processing_time_ms?: number | null
          special_hours_today?: Json | null
          status?: string
          update_category?: string | null
          update_faqs?: Json | null
        }
        Update: {
          ai_provider?: string | null
          business_id?: string
          content_text?: string
          created_at?: string | null
          deal_terms?: string | null
          error_message?: string | null
          expiration_date_time?: string | null
          id?: string
          processing_time_ms?: number | null
          special_hours_today?: Json | null
          status?: string
          update_category?: string | null
          update_faqs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "updates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      can_create_update: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      get_current_usage_period: {
        Args: { business_id_param: string }
        Returns: {
          business_id: string
          created_at: string | null
          id: string
          updated_at: string | null
          updates_limit: number
          updates_used: number
          usage_period_end: string
          usage_period_start: string
        }
      }
      get_user_subscription_status: {
        Args: { user_email_param: string }
        Returns: {
          current_period_end: string
          has_active_subscription: boolean
          plan_name: string
          subscription_status: string
          trial_end: string
        }[]
      }
      increment_usage_count: {
        Args: { business_id_param: string }
        Returns: undefined
      }
      refresh_table_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      primary_category:
        | "food-dining"
        | "shopping"
        | "beauty-grooming"
        | "health-medical"
        | "repairs-services"
        | "professional-services"
        | "activities-entertainment"
        | "education-training"
        | "creative-digital"
        | "transportation-delivery"
      static_tag:
        | "online-only"
        | "physical-location"
        | "hybrid"
        | "mobile-service"
        | "delivery-available"
        | "pickup-available"
        | "ships-nationwide"
        | "24-hours"
        | "emergency-service"
        | "same-day"
        | "by-appointment"
        | "walk-ins"
        | "online-booking"
        | "instant-service"
        | "subscription"
        | "one-time"
        | "hourly"
        | "project-based"
        | "free-consultation"
        | "free-trial"
        | "freemium"
        | "locally-owned"
        | "franchise"
        | "certified"
        | "licensed"
        | "women-owned"
        | "veteran-owned"
        | "minority-owned"
        | "wheelchair-accessible"
        | "remote-available"
        | "multilingual"
        | "beginner-friendly"
        | "kid-friendly"
        | "pet-friendly"
      subscription_status:
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      primary_category: [
        "food-dining",
        "shopping",
        "beauty-grooming",
        "health-medical",
        "repairs-services",
        "professional-services",
        "activities-entertainment",
        "education-training",
        "creative-digital",
        "transportation-delivery",
      ],
      static_tag: [
        "online-only",
        "physical-location",
        "hybrid",
        "mobile-service",
        "delivery-available",
        "pickup-available",
        "ships-nationwide",
        "24-hours",
        "emergency-service",
        "same-day",
        "by-appointment",
        "walk-ins",
        "online-booking",
        "instant-service",
        "subscription",
        "one-time",
        "hourly",
        "project-based",
        "free-consultation",
        "free-trial",
        "freemium",
        "locally-owned",
        "franchise",
        "certified",
        "licensed",
        "women-owned",
        "veteran-owned",
        "minority-owned",
        "wheelchair-accessible",
        "remote-available",
        "multilingual",
        "beginner-friendly",
        "kid-friendly",
        "pet-friendly",
      ],
      subscription_status: [
        "incomplete",
        "incomplete_expired",
        "trialing",
        "active",
        "past_due",
        "canceled",
        "unpaid",
        "paused",
      ],
    },
  },
} as const
