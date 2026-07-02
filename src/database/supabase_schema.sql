-- ============================================================
-- ☕ COFFEE SHOP - SUPABASE DATABASE SCHEMA (CUSTOM USERS CRUD)
-- ============================================================
-- Project : Robby Coffee Shop (Learning Edition)
-- Tables  : 14 tables (Bypassing Supabase Auth, using public.users)
-- Author  : Auto-generated
-- Date    : 2026-06-25
-- Run di  : Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 🧹 RESET SCRIPT: Hapus semua tabel, view, tipe lama agar bersih
-- ────────────────────────────────────────────────────────────
DROP VIEW IF EXISTS v_order_details CASCADE;
DROP VIEW IF EXISTS v_top_selling_items CASCADE;
DROP VIEW IF EXISTS v_member_details CASCADE;
DROP VIEW IF EXISTS v_dashboard_stats CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS delivery_type CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS discount_type CASCADE;
DROP TYPE IF EXISTS membership_status CASCADE;


-- ************************************************************
-- SECTION 1: EXTENSIONS
-- ************************************************************
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ************************************************************
-- SECTION 2: CUSTOM ENUM TYPES
-- ************************************************************
CREATE TYPE user_role AS ENUM ('admin', 'cashier', 'customer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');
CREATE TYPE delivery_type AS ENUM ('dine_in', 'takeaway');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'e_wallet', 'qris');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE membership_status AS ENUM ('active', 'expired', 'suspended');


-- ************************************************************
-- SECTION 3: TABLES
-- ************************************************************

-- ============================================================
-- TABLE 1: users (CUSTOM TABLE FOR CRUD & MANUAL LOGIN)
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT            NOT NULL,
    email           TEXT            NOT NULL UNIQUE,
    password        TEXT            NOT NULL DEFAULT '123456', -- Password manual
    phone           TEXT,
    avatar_url      TEXT,
    role            user_role       NOT NULL DEFAULT 'customer',
    status          user_status     NOT NULL DEFAULT 'active',
    language        TEXT            NOT NULL DEFAULT 'id',
    timezone        TEXT            NOT NULL DEFAULT 'Asia/Jakarta',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Tabel user kustom untuk belajar CRUD dan Login manual';

-- ============================================================
-- TABLE 2: categories
-- ============================================================
CREATE TABLE categories (
    id              SERIAL PRIMARY KEY,
    name            TEXT            NOT NULL,
    slug            TEXT            NOT NULL UNIQUE,
    description     TEXT,
    icon_url        TEXT,
    display_order   INT             NOT NULL DEFAULT 0,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 3: menu_items
-- ============================================================
CREATE TABLE menu_items (
    id              SERIAL PRIMARY KEY,
    category_id     INT             NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name            TEXT            NOT NULL,
    slug            TEXT            NOT NULL UNIQUE,
    description     TEXT,
    price           DECIMAL(10,2)   NOT NULL CHECK (price >= 0),
    image_url       TEXT,
    badge           TEXT,           -- Popular, Best Seller, New, Premium, Featured
    rating          DECIMAL(2,1)    NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    review_count    INT             NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_available    BOOLEAN         NOT NULL DEFAULT TRUE,
    display_order   INT             NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 4: promotions
-- ============================================================
CREATE TABLE promotions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code                TEXT            NOT NULL UNIQUE,
    name                TEXT            NOT NULL,
    description         TEXT,
    discount_type       discount_type   NOT NULL DEFAULT 'percentage',
    discount_value      DECIMAL(10,2)   NOT NULL CHECK (discount_value >= 0),
    min_order_amount    DECIMAL(10,2)   NOT NULL DEFAULT 0,
    start_date          DATE            NOT NULL,
    end_date            DATE            NOT NULL,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    max_uses            INT,            -- NULL = unlimited
    current_uses        INT             NOT NULL DEFAULT 0,
    member_only         BOOLEAN         NOT NULL DEFAULT FALSE,
    min_tier            TEXT,           -- Bronze, Silver, Gold, Platinum
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_promo_dates CHECK (end_date >= start_date)
);

-- ============================================================
-- TABLE 5: orders
-- ============================================================
CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number        TEXT            NOT NULL UNIQUE,
    customer_id         UUID            REFERENCES users(id) ON DELETE SET NULL,
    customer_name       TEXT,           -- Untuk guest checkout
    status              order_status    NOT NULL DEFAULT 'pending',
    delivery_type       delivery_type   NOT NULL DEFAULT 'dine_in',
    table_number        TEXT,
    subtotal            DECIMAL(10,2)   NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount_amount     DECIMAL(10,2)   NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount          DECIMAL(10,2)   NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount        DECIMAL(10,2)   NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    notes               TEXT,
    promotion_id        UUID            REFERENCES promotions(id) ON DELETE SET NULL,
    points_earned       INT             NOT NULL DEFAULT 0,
    points_redeemed     INT             NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 6: order_items
-- ============================================================
CREATE TABLE order_items (
    id              SERIAL PRIMARY KEY,
    order_id        UUID            NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id    INT             REFERENCES menu_items(id) ON DELETE SET NULL,
    item_name       TEXT            NOT NULL,
    quantity        INT             NOT NULL CHECK (quantity > 0),
    unit_price      DECIMAL(10,2)   NOT NULL CHECK (unit_price >= 0),
    subtotal        DECIMAL(10,2)   NOT NULL CHECK (subtotal >= 0),
    notes           TEXT
);

-- ============================================================
-- TABLE 7: payments
-- ============================================================
CREATE TABLE payments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id            UUID            NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method      payment_method  NOT NULL DEFAULT 'cash',
    amount              DECIMAL(10,2)   NOT NULL CHECK (amount >= 0),
    status              payment_status  NOT NULL DEFAULT 'pending',
    transaction_ref     TEXT,
    paid_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 8: reviews
-- ============================================================
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id     UUID            REFERENCES users(id) ON DELETE SET NULL,
    menu_item_id    INT             REFERENCES menu_items(id) ON DELETE SET NULL,
    customer_name   TEXT            NOT NULL,
    category        TEXT            NOT NULL DEFAULT 'Pelayanan',
    rating          INT             NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment         TEXT,
    is_approved     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 9: favorites
-- ============================================================
CREATE TABLE favorites (
    id              SERIAL PRIMARY KEY,
    customer_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    menu_item_id    INT             NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_favorite UNIQUE (customer_id, menu_item_id)
);

-- ============================================================
-- TABLE 10: members 🏆
-- ============================================================
CREATE TABLE members (
    id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    member_code     TEXT            NOT NULL UNIQUE,   -- Auto: MBR-00001
    tier            TEXT            NOT NULL DEFAULT 'Bronze',
    total_points    INT             NOT NULL DEFAULT 0 CHECK (total_points >= 0),
    current_points  INT             NOT NULL DEFAULT 0 CHECK (current_points >= 0),
    join_date       DATE            NOT NULL DEFAULT CURRENT_DATE,
    expired_date    DATE,
    status          membership_status NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 11: addresses
-- ============================================================
CREATE TABLE addresses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label           TEXT            NOT NULL DEFAULT 'Rumah',
    full_address    TEXT            NOT NULL,
    city            TEXT,
    postal_code     TEXT,
    latitude        DECIMAL(10,8),
    longitude       DECIMAL(11,8),
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 12: notifications
-- ============================================================
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       TEXT            NOT NULL,
    message     TEXT            NOT NULL,
    type        TEXT            NOT NULL DEFAULT 'system',
    is_read     BOOLEAN         NOT NULL DEFAULT FALSE,
    data        JSONB           DEFAULT '{}'::JSONB,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 13: app_settings
-- ============================================================
CREATE TABLE app_settings (
    id              SERIAL PRIMARY KEY,
    key             TEXT            NOT NULL UNIQUE,
    value           JSONB           NOT NULL DEFAULT '{}'::JSONB,
    description     TEXT,
    updated_by      UUID            REFERENCES users(id) ON DELETE SET NULL,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 14: activity_logs
-- ============================================================
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID            REFERENCES users(id) ON DELETE SET NULL,
    action          TEXT            NOT NULL,
    entity_type     TEXT            NOT NULL,
    entity_id       TEXT,
    old_data        JSONB,
    new_data        JSONB,
    ip_address      INET,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);


-- ************************************************************
-- SECTION 4: INDEXES
-- ************************************************************
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_slug ON menu_items(slug);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_favorites_customer ON favorites(customer_id);
CREATE INDEX idx_members_code ON members(member_code);
CREATE INDEX idx_members_tier ON members(tier);
CREATE INDEX idx_addresses_customer ON addresses(customer_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;


-- ************************************************************
-- SECTION 5: FUNCTIONS & TRIGGERS
-- ************************************************************

-- ────────────────────────────────────────────────────────
-- Function & Trigger: Update Timestamp `updated_at` otomatis
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_menu_items_updated BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
CREATE TRIGGER trg_members_updated BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ────────────────────────────────────────────────────────
-- Function & Trigger: Generate Nomor Order Otomatis (ORD-001, ...)
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    next_num INT;
BEGIN
    SELECT COALESCE(MAX(CAST(REPLACE(order_number, 'ORD-', '') AS INT)), 0) + 1 INTO next_num FROM orders;
    NEW.order_number = 'ORD-' || LPAD(next_num::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_number BEFORE INSERT ON orders FOR EACH ROW 
WHEN (NEW.order_number IS NULL OR NEW.order_number = '') 
EXECUTE FUNCTION fn_generate_order_number();

-- ────────────────────────────────────────────────────────
-- Function & Trigger: Generate Kode Member Otomatis (MBR-00001, ...)
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_generate_member_code()
RETURNS TRIGGER AS $$
DECLARE
    next_num INT;
BEGIN
    SELECT COALESCE(MAX(CAST(REPLACE(member_code, 'MBR-', '') AS INT)), 0) + 1 INTO next_num FROM members;
    NEW.member_code = 'MBR-' || LPAD(next_num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_member_code BEFORE INSERT ON members FOR EACH ROW 
WHEN (NEW.member_code IS NULL OR NEW.member_code = '') 
EXECUTE FUNCTION fn_generate_member_code();

-- ────────────────────────────────────────────────────────
-- Function & Trigger: Update Rating Menu otomatis saat ulasan disetujui
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_update_menu_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.menu_item_id IS NOT NULL AND NEW.is_approved = TRUE THEN
        UPDATE menu_items
        SET
            rating = (SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM reviews WHERE menu_item_id = NEW.menu_item_id AND is_approved = TRUE),
            review_count = (SELECT COUNT(*) FROM reviews WHERE menu_item_id = NEW.menu_item_id AND is_approved = TRUE)
        WHERE id = NEW.menu_item_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_review_update_rating AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION fn_update_menu_rating();

-- ────────────────────────────────────────────────────────
-- Function & Trigger: Auto Upgrade Tier Member berdasarkan Poin
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_check_tier_upgrade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_points >= 5000 THEN
        NEW.tier = 'Platinum';
    ELSIF NEW.total_points >= 2000 THEN
        NEW.tier = 'Gold';
    ELSIF NEW.total_points >= 500 THEN
        NEW.tier = 'Silver';
    ELSE
        NEW.tier = 'Bronze';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_tier_upgrade BEFORE UPDATE ON members FOR EACH ROW 
WHEN (NEW.total_points != OLD.total_points) 
EXECUTE FUNCTION fn_check_tier_upgrade();


-- ────────────────────────────────────────────────────────
-- Function & Trigger: Notifikasi saat Level Membership Naik
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_notify_tier_upgrade()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (
        NEW.id,
        'Selamat! Level Membership Naik 🎉',
        'Membership Anda telah naik dari ' || OLD.tier || ' ke level ' || NEW.tier || '. Nikmati benefit terbarunya!',
        'membership'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_tier_upgrade
AFTER UPDATE ON members
FOR EACH ROW
WHEN (NEW.tier IS DISTINCT FROM OLD.tier)
EXECUTE FUNCTION fn_notify_tier_upgrade();


-- ────────────────────────────────────────────────────────
-- Function & Trigger: Notifikasi saat Poin Member Berubah
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_notify_points_change()
RETURNS TRIGGER AS $$
DECLARE
    points_diff INT;
BEGIN
    points_diff := NEW.current_points - OLD.current_points;
    IF points_diff > 0 THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.id,
            'Poin Bertambah 🪙',
            'Anda mendapatkan +' || points_diff || ' poin baru! Poin Anda saat ini: ' || NEW.current_points || ' pts.',
            'points'
        );
    ELSIF points_diff < 0 THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.id,
            'Poin Digunakan 🪙',
            'Poin Anda berkurang sebesar ' || ABS(points_diff) || ' pts untuk penukaran reward. Sisa poin: ' || NEW.current_points || ' pts.',
            'points'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_points_change
AFTER UPDATE ON members
FOR EACH ROW
WHEN (NEW.current_points IS DISTINCT FROM OLD.current_points)
EXECUTE FUNCTION fn_notify_points_change();


-- ────────────────────────────────────────────────────────
-- Function & Trigger: Notifikasi saat Pembuatan Order & Perubahan Status Order
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_notify_order_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.customer_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.customer_id,
            'Pesanan Diterima ☕',
            'Pesanan ' || NEW.order_number || ' telah kami terima dan sedang diproses.',
            'order'
        );
    ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status AND NEW.customer_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type)
        VALUES (
            NEW.customer_id,
            CASE 
                WHEN NEW.status = 'processing' THEN 'Pesanan Sedang Dibuat ⏳'
                WHEN NEW.status = 'completed' THEN 'Pesanan Selesai 🎉'
                WHEN NEW.status = 'cancelled' THEN 'Pesanan Dibatalkan ❌'
                ELSE 'Update Status Pesanan 📦'
            END,
            CASE 
                WHEN NEW.status = 'processing' THEN 'Barista kami sedang meracik pesanan ' || NEW.order_number || ' Anda.'
                WHEN NEW.status = 'completed' THEN 'Pesanan ' || NEW.order_number || ' selesai disajikan. Selamat menikmati!'
                WHEN NEW.status = 'cancelled' THEN 'Mohon maaf, pesanan ' || NEW.order_number || ' Anda dibatalkan.'
                ELSE 'Status pesanan ' || NEW.order_number || ' berubah menjadi ' || NEW.status || '.'
            END,
            'order'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_order_status
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_notify_order_status();


-- ************************************************************
-- SECTION 6: ROW LEVEL SECURITY (RLS) & POLICIES (OPEN CRUD FOR LEARNING)
-- ************************************************************
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy global bebas hambatan agar CRUD frontend tidak terhalang RLS (Sangat pas untuk belajar)
CREATE POLICY "Allow public CRUD on users" ON users FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on categories" ON categories FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on menu_items" ON menu_items FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on orders" ON orders FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on order_items" ON order_items FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on payments" ON payments FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on reviews" ON reviews FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on favorites" ON favorites FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on promotions" ON promotions FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on members" ON members FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on addresses" ON addresses FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on notifications" ON notifications FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on app_settings" ON app_settings FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow public CRUD on activity_logs" ON activity_logs FOR ALL USING (TRUE) WITH CHECK (TRUE);


-- ************************************************************
-- SECTION 7: SEED DATA
-- ************************************************************

-- 7.1 Users Seed (Sesuai persis dengan data gambar local kamu)
INSERT INTO users (id, name, email, password, role, status) VALUES
    ('a80260b3-281c-48f1-a4ee-914101b24e8f', 'Budi Santoso', 'budi.santoso@email.com', '123456', 'customer', 'active'),
    ('cbaf2d91-f810-47a2-b952-6092f7ad53e4', 'Siti Rahayu', 'siti.rahayu@email.com', '123456', 'customer', 'active'),
    ('3cd16278-0a9a-4b89-b6bf-c13c83a1423a', 'Rizky Pratama', 'rizky.p@email.com', '123456', 'customer', 'active'),
    ('7ee73c54-2b43-48ca-8804-94af3f9d1f0f', 'Nadia Putri', 'nadia.p@email.com', '123456', 'customer', 'active'),
    ('16c9436b-cd8a-4b3f-8df5-c26e37ddc730', 'Dewi Lestari', 'dewi.l@email.com', '123456', 'customer', 'inactive'),
    ('dc98287b-b8f7-4a46-9841-86987c3de50d', 'Maya Sari', 'maya.sari@email.com', '123456', 'customer', 'active'),
    ('e6cb7b7d-86f3-4216-bdfe-84ccc9d073a6', 'Fajar Nugroho', 'fajar.n@email.com', '123456', 'customer', 'inactive'),
    ('e5195942-37b9-4b50-b0e2-f7faeb16305c', 'r', 'r@gmail.com', '123456', 'admin', 'active'),
    ('e984ee59-750d-44ea-9083-b36646bd1c92', 'ronn', 'robby@gmail.com', '123456', 'admin', 'active');

-- 7.2 Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Hot Coffee',  'hot',      'Minuman kopi panas pilihan terbaik',       1),
    ('Iced Coffee', 'iced',     'Minuman kopi dingin menyegarkan',          2),
    ('Special',     'special',  'Menu spesial dan signature drinks',        3),
    ('Food',        'food',     'Pastry, snack, dan makanan pendamping',    4);

-- 7.3 Menu Items
INSERT INTO menu_items (category_id, name, slug, description, price, image_url, badge, rating, review_count, display_order) VALUES
    (1, 'Americano',           'americano',            'Strong and bold espresso shots',           3.75,   'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',   'Popular',      4.6, 234, 1),
    (1, 'Mocha Delight',       'mocha-delight',        'Rich chocolate and espresso blend',        5.00,   'https://images.unsplash.com/photo-1570968015861-ad48c34c1160?w=400&h=300&fit=crop',   'Best Seller',  4.9, 456, 2),
    (1, 'Caramel Macchiato',   'caramel-macchiato',    'Sweet caramel with espresso',              5.25,   'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop',   'Featured',     4.8, 389, 3),
    (1, 'Double Espresso',     'double-espresso',      'Double shot of premium espresso',          4.00,   'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop',   NULL,           4.7, 278, 4),
    (1, 'Vanilla Latte',       'vanilla-latte',        'Smooth vanilla-infused latte',             4.75,   'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=300&fit=crop',   'New',          4.8, 312, 5),
    (1, 'Flat White',          'flat-white',           'Velvety smooth espresso and milk',          4.25,   'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400&h=400&fit=crop',   NULL,           4.5, 167, 6),
    (2, 'Iced Cappuccino',     'iced-cappuccino',      'Refreshing iced cappuccino',               4.50,   'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop',   NULL,           4.6, 198, 1),
    (3, 'Irish Coffee',        'irish-coffee',         'Classic Irish coffee blend',                5.75,   'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400&h=300&fit=crop',   'Premium',      4.4,  89, 1),
    (3, 'Affogato',            'affogato',             'Espresso poured over ice cream',            5.50,   'https://images.unsplash.com/photo-1594631252845-29fc458631b6?w=400&h=300&fit=crop',   NULL,           4.7, 212, 2),
    (4, 'Butter Croissant',    'butter-croissant',     'Freshly baked flaky butter croissant',      2.50,   'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&h=300&fit=crop',   NULL,           4.5, 145, 1),
    (4, 'Chocolate Muffin',    'chocolate-muffin',     'Rich double chocolate chip muffin',         3.00,   'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop',   'Popular',      4.3,  98, 2);

-- 7.4 Promotions
INSERT INTO promotions (code, name, description, discount_type, discount_value, min_order_amount, start_date, end_date, member_only, min_tier) VALUES
    ('WELCOME10',   'Welcome Discount',     'Diskon 10% untuk pelanggan baru',              'percentage',   10.00,  0,      '2026-01-01', '2026-12-31', FALSE, NULL),
    ('MEMBER20',    'Member Exclusive',      'Diskon 20% khusus member Silver ke atas',      'percentage',   20.00,  15.00,  '2026-01-01', '2026-12-31', TRUE,  'Silver'),
    ('KOPI50',      'Hemat 50rb',           'Potongan Rp50.000 untuk order di atas Rp100k',  'fixed',        50.00,  100.00, '2026-06-01', '2026-08-31', FALSE, NULL);

-- 7.5 Reviews
INSERT INTO reviews (customer_name, category, rating, comment, is_approved, created_at) VALUES
    ('Budi Santoso',    'Pelayanan',    5,  'Baristanya sangat ramah dan penyajian kopinya cepat sekali! Tempatnya bersih dan nyaman.',           TRUE, '2026-06-24T00:00:00+07:00'),
    ('Siti Rahayu',     'Rasa Menu',    4,  'Caramel Macchiato-nya pas manisnya, espresso-nya harum. Sangat direkomendasikan!',                   TRUE, '2026-06-23T00:00:00+07:00');

-- 7.6 App Settings
INSERT INTO app_settings (key, value, description) VALUES
    ('store_name',          '"Robby Coffee Shop"'::JSONB,                                                               'Nama toko'),
    ('store_address',       '"Jl. Kopi Nusantara No. 17, Jakarta Selatan"'::JSONB,                                      'Alamat toko'),
    ('store_phone',         '"+62 812-0000-0000"'::JSONB,                                                               'Nomor telepon toko'),
    ('store_email',         '"hello@robbycoffee.com"'::JSONB,                                                           'Email toko'),
    ('tax_percent',         '11'::JSONB,                                                                                'Persentase pajak (PPN)'),
    ('currency',            '"IDR"'::JSONB,                                                                             'Mata uang'),
    ('points_per_dollar',   '10'::JSONB,                                                                                'Poin yang didapat per $1 belanja'),
    ('min_points_redeem',   '50'::JSONB,                                                                                'Minimum poin untuk redeem'),
    ('membership_enabled',  'true'::JSONB,                                                                              'Fitur membership aktif/nonaktif'),
    ('store_open_time',     '"08:00"'::JSONB,                                                                           'Jam buka toko'),
    ('store_close_time',    '"22:00"'::JSONB,                                                                           'Jam tutup toko'),
    ('social_instagram',    '"@robbycoffeeshop"'::JSONB,                                                                'Instagram handle'),
    ('social_whatsapp',     '"+62 812-0000-0000"'::JSONB,                                                               'WhatsApp number');


-- ************************************************************
-- SECTION 8: DATABASE VIEWS
-- ************************************************************

-- ────────────────────────────────────────────────────────
-- View: Dashboard Stats
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM orders WHERE status = 'completed') AS total_orders_completed,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed') AS total_revenue,
    (SELECT COUNT(*) FROM users WHERE role = 'customer') AS total_customers,
    (SELECT COUNT(*) FROM menu_items WHERE is_available = TRUE) AS total_menu_items,
    (SELECT COUNT(*) FROM members WHERE status = 'active') AS total_active_members;

-- ────────────────────────────────────────────────────────
-- View: Detail Member & Dinamika Benefit Tier
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_member_details AS
SELECT
    m.id AS member_id,
    m.member_code,
    u.name AS full_name,
    u.phone,
    u.avatar_url,
    u.status AS user_status,
    m.tier AS tier_name,
    m.total_points,
    m.current_points,
    m.join_date,
    m.expired_date,
    m.status AS membership_status,
    CASE
        WHEN m.tier = 'Platinum' THEN 3.00
        WHEN m.tier = 'Gold' THEN 2.00
        WHEN m.tier = 'Silver' THEN 1.50
        ELSE 1.00
    END AS points_multiplier,
    CASE
        WHEN m.tier = 'Platinum' THEN 15.00
        WHEN m.tier = 'Gold' THEN 10.00
        WHEN m.tier = 'Silver' THEN 5.00
        ELSE 0.00
    END AS discount_percent
FROM members m
JOIN users u ON u.id = m.id;

-- ────────────────────────────────────────────────────────
-- View: Item Paling Laris
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_top_selling_items AS
SELECT
    mi.id,
    mi.name,
    mi.slug,
    mi.price,
    mi.image_url,
    mi.rating,
    COALESCE(SUM(oi.quantity), 0) AS total_sold,
    COALESCE(SUM(oi.subtotal), 0) AS total_revenue
FROM menu_items mi
LEFT JOIN order_items oi ON oi.menu_item_id = mi.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'completed'
GROUP BY mi.id, mi.name, mi.slug, mi.price, mi.image_url, mi.rating
ORDER BY total_sold DESC;

-- ────────────────────────────────────────────────────────
-- View: Detail Order Lengkap
-- ────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_order_details AS
SELECT
    o.id AS order_id,
    o.order_number,
    o.customer_name,
    u.name AS registered_customer_name,
    o.status,
    o.delivery_type,
    o.table_number,
    o.subtotal,
    o.discount_amount,
    o.tax_amount,
    o.total_amount,
    o.notes,
    o.points_earned,
    o.points_redeemed,
    o.created_at,
    pay.payment_method,
    pay.status AS payment_status,
    pr.code AS promo_code,
    pr.name AS promo_name
FROM orders o
LEFT JOIN users u ON u.id = o.customer_id
LEFT JOIN payments pay ON pay.order_id = o.id
LEFT JOIN promotions pr ON pr.id = o.promotion_id;
