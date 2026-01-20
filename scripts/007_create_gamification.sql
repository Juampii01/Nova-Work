-- Achievements table
CREATE TABLE public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT CHECK (category IN ('perfil', 'networking', 'trabajos', 'comunidad', 'premium')),
  xp_reward INTEGER DEFAULT 0,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User stats for gamification
CREATE TABLE public.user_stats (
  user_id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  total_connections INTEGER DEFAULT 0,
  jobs_posted INTEGER DEFAULT 0,
  jobs_applied INTEGER DEFAULT 0,
  services_sold INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  posts_created INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily challenges
CREATE TABLE public.daily_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  target_count INTEGER DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User challenge progress
CREATE TABLE public.user_challenge_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Achievements viewable by everyone" ON public.achievements
  FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "User achievements viewable by everyone" ON public.user_achievements
  FOR SELECT USING (true);

CREATE POLICY "System can award achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (true);

-- User stats policies
CREATE POLICY "User stats viewable by everyone" ON public.user_stats
  FOR SELECT USING (true);

CREATE POLICY "Users own stats updatable" ON public.user_stats
  FOR ALL USING (auth.uid() = user_id);

-- Daily challenges policies
CREATE POLICY "Challenges viewable by everyone" ON public.daily_challenges
  FOR SELECT USING (true);

-- User challenge progress policies
CREATE POLICY "Users can view own progress" ON public.user_challenge_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_challenge_progress
  FOR ALL USING (auth.uid() = user_id);

-- Function to create user stats on profile creation
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_stats_on_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats();
