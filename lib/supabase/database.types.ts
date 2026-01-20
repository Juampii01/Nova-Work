

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
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          category: "perfil" | "networking" | "trabajos" | "comunidad" | "premium" | null
          xp_reward: number | null
          tier: "bronze" | "silver" | "gold" | "platinum" | null
          created_at: string | null
        }
        Insert: Partial<Omit<Database["public"]["Tables"]["achievements"]["Row"], "id">>
        Update: Partial<Database["public"]["Tables"]["achievements"]["Row"]>
      }

      applications: {
        Row: {
          id: string
          job_id: string | null
          user_id: string | null
          status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted" | null
          cover_letter: string | null
          resume_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Partial<Omit<Database["public"]["Tables"]["applications"]["Row"], "id">>
        Update: Partial<Database["public"]["Tables"]["applications"]["Row"]>
      }

      companies: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website: string | null
          description: string | null
          industry: string | null
          size: string | null
          location: Json | null
          location_text: string | null
          is_verified: boolean | null
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Partial<Omit<Database["public"]["Tables"]["companies"]["Row"], "id">>
        Update: Partial<Database["public"]["Tables"]["companies"]["Row"]>
      }

      jobs: {
        Row: {
          id: string
          company_id: string | null
          posted_by: string | null
          title: string
          description: string
          category: string
          modality: "presencial" | "remoto" | "híbrido" | null
          job_type: "tiempo_completo" | "medio_tiempo" | "por_proyecto" | "freelance" | null
          location: Json | null
          location_text: string | null
          salary_min: number | null
          salary_max: number | null
          salary_currency: string | null
          show_salary: boolean | null
          requirements: string[] | null
          benefits: string[] | null
          status: "active" | "closed" | "draft" | null
          views: number | null
          applications: number | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Partial<Omit<Database["public"]["Tables"]["jobs"]["Row"], "id">>
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>
      }

      notifications: {
        Row: {
          id: string
          user_id: string | null
          type:
            | "job_match"
            | "application"
            | "message"
            | "review"
            | "connection"
            | "event"
            | "achievement"
            | "system"
          title: string
          content: string
          link_url: string | null
          icon: string | null
          is_read: boolean | null
          read_at: string | null
          created_at: string | null
        }
        Insert: Partial<Omit<Database["public"]["Tables"]["notifications"]["Row"], "id">>
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>
      }

      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          location: Json | null
          location_text: string | null
          profession: string | null
          experience_years: number | null
          hourly_rate: number | null
          is_verified: boolean | null
          verification_level: string | null
          is_premium: boolean | null
          premium_tier: "free" | "plus" | "pro" | null
          premium_expires_at: string | null
          total_reviews: number | null
          average_rating: number | null
          profile_views: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>
      }
    }

    Views: {}

    Functions: {}

    Enums: {}

    CompositeTypes: {}
  }
}