CREATE TABLE users (
    usr_id SERIAL PRIMARY KEY,
    usr_email VARCHAR(255) NOT NULL UNIQUE,
    usr_password VARCHAR(255) NOT NULL,
    usr_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    exp_id SERIAL PRIMARY KEY,
    usr_id INT NOT NULL,

    exp_title VARCHAR(255) NOT NULL,
    exp_amount DECIMAL(10,2) NOT NULL,
    exp_type VARCHAR(10) NOT NULL,       -- income | expense
    exp_category VARCHAR(100) NOT NULL,  -- Food, Transport, ...
    exp_note TEXT,
    exp_date DATE NOT NULL,
    exp_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (usr_id)
        REFERENCES users(usr_id)
);

-- insert --
INSERT INTO users (usr_email, usr_password)
VALUES
('spendlyuser1@gmail.com', 'spendly_user1'),
('spendlyuser2@gmail.com', 'spendly_user2');

INSERT INTO expenses
(usr_id, exp_title, exp_amount, exp_type, exp_category, exp_note, exp_date)
VALUES
(1, 'Salary January', 25000.00, 'income', 'Salary', 'เงินเดือน', '2026-01-01'),
(1, 'Lunch', 80.00, 'expense', 'Food', 'ข้าวกลางวัน', '2026-01-02'),
(1, 'Dinner', 120.00, 'expense', 'Food', 'ข้าวเย็น', '2026-01-03'),
(1, 'Bus fare', 40.00, 'expense', 'Transport', 'ไปทำงาน', '2026-01-04'),
(1, 'Internet bill', 650.00, 'expense', 'Bills', 'ค่าเน็ตบ้าน', '2026-01-05'),
(1, 'Movie', 180.00, 'expense', 'Entertainment', 'ดูหนัง', '2026-01-06');

INSERT INTO expenses
(usr_id, exp_title, exp_amount, exp_type, exp_category, exp_note, exp_date)
VALUES
(2, 'Freelance payment', 8000.00, 'income', 'Salary', 'งานฟรีแลนซ์', '2026-01-02'),
(2, 'Groceries', 520.00, 'expense', 'Food', 'ซื้อของเข้าบ้าน', '2026-01-03'),
(2, 'Taxi', 150.00, 'expense', 'Transport', 'กลับบ้านดึก', '2026-01-04'),
(2, 'Electricity bill', 900.00, 'expense', 'Bills', 'ค่าไฟ', '2026-01-05');

-- index.ts -> config -> service -> controller -> routes