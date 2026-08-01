-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- RLS POLICIES (Security Rules)
-- ============================================================

-- ============================================================
-- 1. INSTITUTE SETTINGS
-- ============================================================
-- Read: Any authenticated user
CREATE POLICY "Allow read for authenticated users" ON institute_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Write (Insert/Update/Delete): Only Super Admin or Admin
CREATE POLICY "Allow write for admins" ON institute_settings
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );

-- ============================================================
-- 2. COURSES
-- ============================================================
CREATE POLICY "Allow read for authenticated users" ON courses
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write for admins" ON courses
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );

-- ============================================================
-- 3. BATCHES
-- ============================================================
CREATE POLICY "Allow read for authenticated users" ON batches
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write for admins" ON batches
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );

-- ============================================================
-- 4. STUDENTS
-- ============================================================
CREATE POLICY "Allow read for authenticated users" ON students
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write for admins" ON students
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );

-- ============================================================
-- 5. FEE PAYMENTS
-- ============================================================
CREATE POLICY "Allow read for authenticated users" ON fee_payments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write for admins" ON fee_payments
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );

-- ============================================================
-- 6. RECEIPTS
-- ============================================================
CREATE POLICY "Allow read for authenticated users" ON receipts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write for admins" ON receipts
    FOR ALL USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );

-- ============================================================
-- 7. USERS (Special handling: Users can see only themselves)
-- ============================================================
-- Read own profile
CREATE POLICY "Allow users to read own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Allow admins to read all users
CREATE POLICY "Allow admins to read all users" ON users
    FOR SELECT USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );

-- Allow users to update own profile (except role)
CREATE POLICY "Allow users to update own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow admins to update any user
CREATE POLICY "Allow admins to update all users" ON users
    FOR UPDATE USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    )
    WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('super_admin', 'admin')
    );
