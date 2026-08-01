-- 1. FUNCTION: Automatically handle new user signup from Supabase Auth to Public Users Table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'System User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Run function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. FUNCTION: Automatically generate unique Receipt Number (e.g., REC-1001)
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS TRIGGER AS $$
DECLARE
  next_val INT;
  formatted_receipt_no VARCHAR(50);
BEGIN
  SELECT COUNT(*) + 1001 INTO next_val FROM public.receipts;
  formatted_receipt_no := 'REC-' || next_val;

  INSERT INTO public.receipts (receipt_number, payment_id, student_id)
  VALUES (formatted_receipt_no, NEW.id, NEW.student_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Generate receipt after fee payment is recorded
DROP TRIGGER IF EXISTS on_fee_payment_created ON public.fee_payments;
CREATE TRIGGER on_fee_payment_created
  AFTER INSERT ON public.fee_payments
  FOR EACH ROW EXECUTE FUNCTION public.generate_receipt_number();
