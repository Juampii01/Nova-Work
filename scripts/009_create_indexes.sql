-- Performance indexes

-- Profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_location ON public.profiles USING GIST(location);
CREATE INDEX idx_profiles_profession ON public.profiles(profession);
CREATE INDEX idx_profiles_verification ON public.profiles(is_verified);

-- Jobs
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_location ON public.jobs USING GIST(location);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_jobs_company ON public.jobs(company_id);

-- Applications
CREATE INDEX idx_applications_user ON public.applications(user_id);
CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_status ON public.applications(status);

-- Messages
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_reviewee ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Services
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_provider ON public.services(provider_id);
CREATE INDEX idx_services_status ON public.services(status);

-- Events
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_location ON public.events USING GIST(location);
CREATE INDEX idx_events_category ON public.events(category);

-- Groups
CREATE INDEX idx_groups_category ON public.groups(category);
CREATE INDEX idx_group_posts_group ON public.group_posts(group_id);

-- Notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
