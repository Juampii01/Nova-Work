// Obtener perfiles cerca de una ubicación (lat/lng, radio en km)
export async function getProfilesNear({ lat, lng, radiusKm = 10, filters }: { lat: number; lng: number; radiusKm?: number; filters?: { profession?: string; isVerified?: boolean } }) {
  const supabase = getSupabase()
  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  // Filtro por distancia usando PostGIS ST_DWithin
  query = query.filter(
    "location",
    "st_dwithin",
    `SRID=4326;POINT(${lng} ${lat}),${radiusKm * 1000}`
  )

  if (filters?.profession) {
    query = query.eq("profession", filters.profession)
  }
  if (filters?.isVerified !== undefined) {
    query = query.eq("is_verified", filters.isVerified)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching profiles near:", error)
    return []
  }

  return data as Profile[]
}
// Obtener jobs cerca de una ubicación (lat/lng, radio en km)
export async function getJobsNear({ lat, lng, radiusKm = 10, filters }: { lat: number; lng: number; radiusKm?: number; filters?: { category?: string; modality?: string; job_type?: string } }) {
  const supabase = getSupabase()
  let query = supabase
    .from("jobs")
    .select(`*, companies (id, name, logo_url, slug, is_verified)`)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Filtro por distancia usando PostGIS ST_DWithin
  query = query.filter(
    "location",
    "st_dwithin",
    `SRID=4326;POINT(${lng} ${lat}),${radiusKm * 1000}`
  )

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }
  if (filters?.modality) {
    query = query.eq("modality", filters.modality)
  }
  if (filters?.job_type) {
    query = query.eq("job_type", filters.job_type)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching jobs near:", error)
    return []
  }

  return data as (Job & { companies?: { id: string; name: string; logo_url?: string; slug: string } })[]
}
import { createClient } from "@/lib/supabase/client"

function getSupabase() {
  const supabase = createClient()
  if (!supabase) {
    throw new Error(
      "Supabase client no inicializado. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu .env.local (y reinicia el dev server)."
    )
  }
  return supabase
}

export interface Job {
  id: string
  company_id: string | null
  posted_by: string | null

  title: string
  description: string
  benefits?: string[]
  requirements?: string[]
  category: string

  modality: "presencial" | "remoto" | "híbrido"
  job_type: "tiempo_completo" | "medio_tiempo" | "por_proyecto" | "freelance"

  location_text?: string | null

  salary_min?: number | null
  salary_max?: number | null
  salary_currency?: string | null

  show_salary: boolean
  status: "active" | "closed" | "draft"

  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  role: "candidate" | "recruiter" | "admin" | null
  full_name?: string
  username?: string
  avatar_url?: string
  bio?: string
  phone?: string
  location_text?: string
  profession?: string
  experience_years?: number
  hourly_rate?: number
  is_verified: boolean
  verification_level?: string
  is_premium: boolean
  premium_tier?: string
  total_reviews: number
  average_rating: number
  profile_views: number
  created_at: string
  updated_at: string
}

export async function getJobs(filters?: { category?: string; modality?: string; job_type?: string }) {
  const supabase = getSupabase()
  let query = supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url,
        slug,
        is_verified
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }
  if (filters?.modality) {
    query = query.eq("modality", filters.modality)
  }
  if (filters?.job_type) {
    query = query.eq("job_type", filters.job_type)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching jobs:", error)
    return []
  }

  return data as (Job & { companies?: { id: string; name: string; logo_url?: string; slug: string } })[]
}

export async function getJob(id: string) {
  const supabase = getSupabase()
  // Obtener job principal
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url,
        slug
      )
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error("[v0] Error fetching job:", error)
    return null
  }

  // Contar postulaciones
  const { count: applications_count } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("job_id", id)

  // Contar guardados
  const { count: saved_count } = await supabase
    .from("saved_jobs")
    .select("id", { count: "exact", head: true })
    .eq("job_id", id)

  // Contar vistas
  const { count: views } = await supabase
    .from("job_views")
    .select("id", { count: "exact", head: true })
    .eq("job_id", id)

  return {
    ...data,
    applications_count: applications_count || 0,
    saved_count: saved_count || 0,
    views: views || 0,
  }
}

export async function getSimilarJobs(category: string, excludeJobId: string, limit = 3) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url,
        slug
      )
    `)
    .eq("category", category)
    .eq("status", "active")
    .neq("id", excludeJobId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching similar jobs:", error)
    return []
  }

  return data as (Job & { companies?: { id: string; name: string; logo_url?: string; slug: string } })[]
}

export async function saveJob(jobId: string) {
  const supabase = getSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("[v0] Error fetching user:", authError)
    return false
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("user_id", user.id)
    .eq("job_id", jobId)
    .single()

  if (existing) {
    // Remove from saved
    const { error } = await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId)

    if (error) {
      console.error("[v0] Error removing saved job:", error)
      return false
    }
    return true
  } else {
    // Add to saved
    const { error } = await supabase.from("saved_jobs").insert({
      user_id: user.id,
      job_id: jobId,
    })

    if (error) {
      console.error("[v0] Error saving job:", error)
      return false
    }
    return true
  }
}

export async function createJob(jobData: Partial<Job>) {
  const supabase = getSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("[v0] Error fetching user:", authError)
    throw new Error("User not authenticated")
  }

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      ...jobData,
      posted_by: user.id,
      status: "active",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating job:", error)
    throw error
  }

  return data as Job
}

export async function getProfile(userId: string) {
  const supabase = getSupabase()

  // Get profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError) {
    console.error("[v0] Error fetching profile:", profileError)
    return null
  }

  // Get skills separately
  const { data: skillsData, error: skillsError } = await supabase
    .from("skills")
    .select("name, level, years")
    .eq("user_id", userId)

  if (skillsError) {
    console.error("[v0] Error fetching skills:", skillsError)
  }

  const formattedData = {
    ...profileData,
    skills: skillsData?.map((s: any) => s.name) || [],
  }

  return formattedData as Profile & { skills: string[] }
}

export async function getProfileByUsername(username: string) {
  const supabase = getSupabase()

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle()

  if (profileError) {
    console.error("[v0] Error fetching profile by username:", profileError)
    return null
  }

  if (!profileData) {
    console.log("[v0] Profile not found for username:", username)
    return null
  }

  // Get skills separately
  const { data: skillsData, error: skillsError } = await supabase
    .from("skills")
    .select("name, level, years")
    .eq("user_id", profileData.id)

  if (skillsError) {
    console.error("[v0] Error fetching skills:", skillsError)
  }

  const formattedData = {
    ...profileData,
    skills: skillsData?.map((s: any) => s.name) || [],
  }

  return formattedData as Profile & { skills: string[] }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("[v0] Error updating profile:", error)
    throw error
  }

  return data as Profile
}

export async function getProfiles(filters?: { profession?: string; isVerified?: boolean }) {
  const supabase = getSupabase()
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (filters?.profession) {
    query = query.eq("profession", filters.profession)
  }
  if (filters?.isVerified !== undefined) {
    query = query.eq("is_verified", filters.isVerified)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching profiles:", error)
    return []
  }

  return data as Profile[]
}

export async function getSkills(userId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("skills").select("*").eq("user_id", userId)

  if (error) {
    console.error("[v0] Error fetching skills:", error)
    return []
  }

  return data
}

export async function addSkill(userId: string, skill: { name: string; level: string; years?: number }) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("skills")
    .insert({ user_id: userId, ...skill })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding skill:", error)
    throw error
  }

  return data
}

export async function createBetaRequest(request: {
  full_name: string
  email: string
  profession: string
  reason: string
}) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("beta_requests").insert(request).select().single()

  if (error) {
    console.error("[v0] Error creating beta request:", error)
    throw error
  }

  return data
}

export async function getBetaRequests() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("beta_requests").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching beta requests:", error)
    return []
  }

  return data
}

export async function updateBetaRequestStatus(id: string, status: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("beta_requests")
    .update({ status, invited_at: status === "approved" ? new Date().toISOString() : null })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating beta request:", error)
    throw error
  }

  return data
}

export async function connectWithUser(userId: string) {
  const supabase = getSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error("[v0] Error fetching user:", authError)
    return false
  }

  const { error } = await supabase.from("connections").insert({
    user_id: user.id,
    connected_user_id: userId,
    status: "pending",
  })

  if (error) {
    console.error("[v0] Error connecting with user:", error)
    return false
  }

  return true
}

// ========== RECRUITER DASHBOARD FUNCTIONS ==========

export async function getRecruiterJobs(userId: string) {
  const supabase = getSupabase()

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", userId)
    .maybeSingle()

  if (!profile?.company_id) {
    return []
  }

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      id,
      title,
      description,
      category,
      modality,
      job_type,
      location_text,
      salary_min,
      salary_max,
      salary_currency,
      show_salary,
      status,
      created_at,
      updated_at,
      companies (id, name, logo_url, slug, is_verified)
    `
    )
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching recruiter jobs:", error)
    return []
  }

  return data || []
}

export async function getJobApplications(jobId: string) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id,
      status,
      created_at,
      updated_at,
      profiles (id, full_name, username, avatar_url, profession, email)
    `
    )
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching applications:", error)
    return []
  }

  return data || []
}

export async function updateJobStatus(jobId: string, status: "active" | "closed" | "draft") {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("jobs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", jobId)
    .select()

  if (error) {
    console.error("[v0] Error updating job status:", error)
    return null
  }

  return data?.[0] || null
}

export async function deleteJob(jobId: string) {
  const supabase = getSupabase()

  const { error } = await supabase.from("jobs").delete().eq("id", jobId)

  if (error) {
    console.error("[v0] Error deleting job:", error)
    return false
  }

  return true
}

export async function updateApplicationStatus(applicationId: string, status: "pending" | "viewed" | "rejected" | "accepted") {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId)
    .select()

  if (error) {
    console.error("[v0] Error updating application status:", error)
    return null
  }

  return data?.[0] || null
}

export async function getApplicationsByStatus(userId: string, applicationStatus: "pending" | "viewed" | "rejected" | "accepted") {
  const supabase = getSupabase()

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", userId)
    .maybeSingle()

  if (!profile?.company_id) {
    return []
  }

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id,
      status,
      created_at,
      jobs (id, title),
      profiles (id, full_name, username, avatar_url, profession)
    `
    )
    .eq("jobs.company_id", profile.company_id)
    .eq("status", applicationStatus)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching applications by status:", error)
    return []
  }

  return data || []
}

export async function getRecruiterStats(userId: string) {
  const supabase = getSupabase()

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", userId)
    .maybeSingle()

  if (!profile?.company_id) {
    return { totalJobs: 0, totalApplications: 0, activeJobs: 0 }
  }

  const { count: totalJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("company_id", profile.company_id)

  const { count: activeJobs } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("company_id", profile.company_id)
    .eq("status", "active")

  const { count: totalApplications } = await supabase
    .from("applications")
    .select("id, jobs!inner(company_id)", { count: "exact", head: true })
    .eq("jobs.company_id", profile.company_id)

  return {
    totalJobs: totalJobs || 0,
    totalApplications: totalApplications || 0,
    activeJobs: activeJobs || 0,
  }
}

// ============= APPLICATIONS =============

export async function createApplication(jobId: string, userId: string) {
  const supabase = getSupabase()

  // Check if already applied
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .maybeSingle()

  if (existing) {
    return { error: "Ya has aplicado a este job", success: false }
  }

  // Check if user is owner of the job
  const { data: job } = await supabase
    .from("jobs")
    .select("posted_by")
    .eq("id", jobId)
    .single()
  if (job?.posted_by === userId) {
    return { error: "No puedes postularte a tu propio aviso", success: false }
  }

  // Create application
  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        job_id: jobId,
        user_id: userId,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    console.error("[Database] Error creating application:", error)
    return { error: error.message, success: false }
  }

  return { data, success: true }
}

export async function hasUserApplied(jobId: string, userId: string): Promise<boolean> {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("user_id", userId)
    .maybeSingle()

  return !!data
}

export async function getApplicationsByUser(userId: string) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      jobs (
        id,
        title,
        company_id,
        location_text,
        salary_min,
        salary_max,
        created_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[Database] Error fetching user applications:", error)
    return []
  }

  return data || []
}

export async function getCandidateProfile(userId: string) {
  const supabase = getSupabase()

  // Obtener perfil
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle()

  if (profileError || !profile) {
    console.error("[Database] Error fetching candidate profile:", profileError)
    return null
  }

  // Obtener skills
  const { data: skills } = await supabase
    .from("candidate_skills")
    .select("*")
    .eq("user_id", userId)
    .order("level", { ascending: false })

  // Obtener experiencia
  const { data: experience } = await supabase
    .from("candidate_experience")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false })

  // Obtener certificaciones
  const { data: certifications } = await supabase
    .from("candidate_certifications")
    .select("*")
    .eq("user_id", userId)
    .order("issue_date", { ascending: false })

  // Obtener promedio de ratings
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewed_user_id", userId)

  const average_rating =
    reviewsData && reviewsData.length > 0
      ? reviewsData.reduce((sum: number, r: { rating?: number }) => sum + (r.rating || 0), 0) / reviewsData.length
      : 0

  return {
    ...profile,
    average_rating,
    total_reviews: reviewsData?.length || 0,
    skills: skills || [],
    experience: experience || [],
    certifications: certifications || [],
  }
}

// ========== MESSAGING SYSTEM ==========

export async function sendMessage(senderId: string, recipientId: string, content: string, jobId?: string) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        job_id: jobId || null,
        created_at: new Date().toISOString(),
        read: false,
      },
    ])
    .select()

  if (error) {
    console.error("[Database] Error sending message:", error)
    return { error: error.message, success: false }
  }

  return { data: data?.[0], success: true }
}

export async function getConversation(userId1: string, userId2: string) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[Database] Error fetching conversation:", error)
    return []
  }

  return data || []
}

export async function getConversationList(userId: string) {
  const supabase = getSupabase()

  // Obtener últimos mensajes de cada conversación
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[Database] Error fetching conversations:", error)
    return []
  }

  // Agrupar por usuario y obtener último mensaje
  const conversationsMap = new Map<string, any>()
  
  data?.forEach((msg: any) => {
    const otherUserId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id
    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, msg)
    }
  })

  // Obtener info de los otros usuarios
  const userIds = Array.from(conversationsMap.keys())
  if (userIds.length === 0) return []

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds)

  return userIds.map((otherUserId) => {
    const msg = conversationsMap.get(otherUserId)
    const profile = profiles?.find((p: any) => p.id === otherUserId)
    return {
      userId: otherUserId,
      lastMessage: msg.content,
      lastMessageTime: msg.created_at,
      unread: msg.recipient_id === userId && !msg.read,
      profile: profile || { id: otherUserId, full_name: "Usuario" },
    }
  })
}

export async function markMessagesAsRead(userId: string, otherId: string) {
  const supabase = getSupabase()

  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("recipient_id", userId)
    .eq("sender_id", otherId)

  if (error) {
    console.error("[Database] Error marking messages as read:", error)
  }
}

// ========== ANALYTICS ==========

export async function getJobsViewsOverTime(userId: string, days: number = 30) {
  const supabase = getSupabase()

  // Get recruiter's company
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", userId)
    .maybeSingle()

  if (!profile?.company_id) return []

  // Get applications grouped by date
  const { data, error } = await supabase
    .from("applications")
    .select("created_at, jobs!inner(company_id)")
    .eq("jobs.company_id", profile.company_id)
    .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[Database] Error fetching views over time:", error)
    return []
  }

  // Group by date
  const grouped = new Map<string, number>()
  data?.forEach((app: any) => {
    const date = new Date(app.created_at).toLocaleDateString("es-AR")
    grouped.set(date, (grouped.get(date) || 0) + 1)
  })

  // Create array with all dates in range
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toLocaleDateString("es-AR")
    result.push({
      date: dateStr,
      applications: grouped.get(dateStr) || 0,
    })
  }

  return result
}

export async function getApplicationsByCategory(userId: string) {
  const supabase = getSupabase()

  // Get recruiter's company
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", userId)
    .maybeSingle()

  if (!profile?.company_id) return []

  // Get applications grouped by job category
  const { data, error } = await supabase
    .from("applications")
    .select("jobs!inner(category)")
    .eq("jobs.company_id", profile.company_id)

  if (error) {
    console.error("[Database] Error fetching applications by category:", error)
    return []
  }

  // Group by category
  const grouped = new Map<string, number>()
  data?.forEach((app: any) => {
    const category = app.jobs?.category || "Sin categoría"
    grouped.set(category, (grouped.get(category) || 0) + 1)
  })

  // Convert to array and sort
  return Array.from(grouped.entries())
    .map(([category, count]) => ({ category, applications: count }))
    .sort((a, b) => b.applications - a.applications)
}

export async function getApplicationStatusBreakdown(userId: string) {
  const supabase = getSupabase()

  // Get recruiter's company
  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", userId)
    .maybeSingle()

  if (!profile?.company_id) {
    return { pending: 0, viewed: 0, accepted: 0, rejected: 0 }
  }

  // Get count by status
  const statuses = ["pending", "viewed", "accepted", "rejected"]
  const result = { pending: 0, viewed: 0, accepted: 0, rejected: 0 }

  for (const status of statuses) {
    const { count } = await supabase
      .from("applications")
      .select("id, jobs!inner(company_id)", { count: "exact", head: true })
      .eq("status", status)
      .eq("jobs.company_id", profile.company_id)

    result[status as keyof typeof result] = count || 0
  }

  return result
}

