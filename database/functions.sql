-- ============================================================
-- NEW GLOBUS OFFICE ERP v3.0
-- Database Functions
-- ============================================================

-- ============================================================
-- AUTO STUDENT CODE
-- Format: NG260001
-- ============================================================

CREATE OR REPLACE FUNCTION generate_student_code()
RETURNS TEXT AS $$
DECLARE
next_num INTEGER;
year_part TEXT;
BEGIN
year_part := to_char(current_date, 'YY');

```
SELECT COALESCE(MAX(
    CAST(RIGHT(student_code, 4) AS INTEGER)
), 0) + 1
INTO next_num
FROM students
WHERE student_code LIKE 'NG' || year_part || '%';

RETURN 'NG' || year_part || LPAD(next_num::TEXT, 4, '0');
```

END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- AUTO RECEIPT NUMBER
-- Format: RCP260001
-- ============================================================

CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
next_num INTEGER;
year_part TEXT;
BEGIN
year_part := to_char(current_date, 'YY');

```
SELECT COALESCE(MAX(
    CAST(RIGHT(receipt_number, 4) AS INTEGER)
), 0) + 1
INTO next_num
FROM receipts
WHERE receipt_number LIKE 'RCP' || year_part || '%';

RETURN 'RCP' || year_part || LPAD(next_num::TEXT, 4, '0');
```

END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- AUTO UPDATE BALANCE
-- ============================================================

CREATE OR REPLACE FUNCTION update_student_balance()
RETURNS TRIGGER AS $$
BEGIN
UPDATE students
SET
paid_amount = (
SELECT COALESCE(SUM(amount), 0)
FROM fee_payments
WHERE student_id = NEW.student_id
),
balance_amount = total_fee - (
SELECT COALESCE(SUM(amount), 0)
FROM fee_payments
WHERE student_id = NEW.student_id
)
WHERE id = NEW.student_id;

```
RETURN NEW;
```

END;
$$ LANGUAGE plpgsql;
