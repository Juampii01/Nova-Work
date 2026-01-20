-- Services table (marketplace)
CREATE TABLE public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  pricing_type TEXT CHECK (pricing_type IN ('fixed', 'hourly', 'project')) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  delivery_time INTEGER, -- in days
  revisions INTEGER,
  images TEXT[],
  requirements TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'draft')) DEFAULT 'active',
  views INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service packages/tiers
CREATE TABLE public.service_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT CHECK (name IN ('basic', 'standard', 'premium')) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  delivery_time INTEGER NOT NULL,
  revisions INTEGER,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service orders
CREATE TABLE public.service_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.service_packages(id),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'revision', 'completed', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  requirements TEXT,
  delivery_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Active services are viewable by everyone" ON public.services
  FOR SELECT USING (status = 'active' OR auth.uid() = provider_id);

CREATE POLICY "Providers can create services" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update own services" ON public.services
  FOR UPDATE USING (auth.uid() = provider_id);

-- Service packages policies
CREATE POLICY "Packages viewable with services" ON public.service_packages
  FOR SELECT USING (true);

CREATE POLICY "Providers can manage packages" ON public.service_packages
  FOR ALL USING (
    auth.uid() IN (SELECT provider_id FROM public.services WHERE id = service_id)
  );

-- Service orders policies
CREATE POLICY "Users can view own orders" ON public.service_orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = provider_id);

CREATE POLICY "Buyers can create orders" ON public.service_orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update orders" ON public.service_orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = provider_id);

-- Triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
