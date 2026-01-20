-- Beta testing requests table
CREATE TABLE IF NOT EXISTS public.beta_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  profession TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'invited')),
  invited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.beta_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert beta requests
CREATE POLICY "Anyone can submit beta requests" ON public.beta_requests
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view their own requests
CREATE POLICY "Users can view own beta requests" ON public.beta_requests
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Index for faster lookups
CREATE INDEX idx_beta_requests_email ON public.beta_requests(email);
CREATE INDEX idx_beta_requests_status ON public.beta_requests(status);

-- Trigger for updated_at
CREATE TRIGGER set_beta_requests_updated_at
  BEFORE UPDATE ON public.beta_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
