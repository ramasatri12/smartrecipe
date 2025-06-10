DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS user_inventory;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS users;

-- Ekstensi untuk menghasilkan UUID jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabel untuk Pengguna
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel master untuk Bahan Makanan
-- Ini adalah daftar bahan yang sudah kita tentukan untuk MVP
CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY, -- Menggunakan SERIAL untuk kemudahan seeding
    name VARCHAR(100) UNIQUE NOT NULL,
    unit VARCHAR(20) NOT NULL -- e.g., 'gram', 'ml', 'butir', 'buah'
);

-- Tabel untuk Resep
-- Ini adalah daftar resep yang sudah ditentukan untuk MVP
CREATE TABLE recipes (
    recipe_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    instructions TEXT NOT NULL,
    prep_time_minutes INT,
    image_url TEXT
);

-- Tabel untuk Inventaris Dapur Pengguna
CREATE TABLE user_inventory (
    inventory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE RESTRICT,
    quantity NUMERIC(10, 2) NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel penghubung antara Resep dan Bahan (Many-to-Many)
CREATE TABLE recipe_ingredients (
    recipe_id INT NOT NULL REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(ingredient_id) ON DELETE RESTRICT,
    quantity NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- Tambahkan index untuk optimasi query
CREATE INDEX idx_user_inventory_user_id ON user_inventory(user_id);