-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.institute_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- 1. INSTITUTE SETTINGS POLICIES
CREATE POLICY "Allow authenticated read institute_settings" 
ON public.institute_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin full access institute_settings" 
ON public.institute_settings FOR ALL TO authenticated USING (true);

-- 2. USERS POLICIES
CREATE POLICY "Allow authenticated read users" 
ON public.users FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow individual user update" 
ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 3. COURSES POLICIES
CREATE POLICY "Allow authenticated access courses" 
ON public.courses FOR ALL TO authenticated USING (true);

-- 4. BATCHES POLICIES
CREATE POLICY "Allow authenticated access batches" 
ON public.batches FOR ALL TO authenticated USING (true);

-- 5. STUDENTS POLICIES
CREATE POLICY "Allow authenticated access students" 
ON public.students FOR ALL TO authenticated USING (true);

-- 6. FEE PAYMENTS POLICIES
CREATE POLICY "Allow authenticated access fee_payments" 
ON public.fee_payments FOR ALL TO authenticated USING (true);

-- 7. RECEIPTS POLICIES
CREATE POLICY "Allow authenticated access receipts" 
ON public.receipts FOR ALL TO authenticated USING (true);
