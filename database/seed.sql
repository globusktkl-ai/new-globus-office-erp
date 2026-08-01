-- 1. INSERT DEFAULT INSTITUTE SETTINGS
INSERT INTO public.institute_settings (institute_name, tagline, email, phone, address)
VALUES (
    'Globus Office & Institute', 
    'Advanced Office & Technical ERP', 
    'info@globusoffice.com', 
    '+91 9876543210', 
    'Main Road, Calicut, Kerala'
) ON CONFLICT DO NOTHING;

-- 2. INSERT SAMPLE COURSES
INSERT INTO public.courses (id, course_name, course_code, duration_months, fee_amount, status)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Advanced Mobile Phone Hardware', 'AMPH-01', 6, 25000.00, 'active'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Basic Electronics & Soldering', 'BES-02', 2, 8000.00, 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Smartphone Software Repair', 'SSR-03', 3, 12000.00, 'active')
ON CONFLICT (course_code) DO NOTHING;

-- 3. INSERT SAMPLE BATCHES
INSERT INTO public.batches (id, course_id, batch_name, start_date, end_date, status)
VALUES 
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Batch 2026-Q1 (Morning)', '2026-01-10', '2026-07-10', 'ongoing'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Batch 2026-Feb (Evening)', '2026-02-01', '2026-04-01', 'completed')
ON CONFLICT DO NOTHING;
