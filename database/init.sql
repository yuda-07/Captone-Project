-- =====================================================
-- MicroCred AI - Database Schema
-- PostgreSQL Database Setup
-- =====================================================

-- Create database (run this separately if needed)
-- CREATE DATABASE microcred_ai;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: users
-- Stores registered user accounts
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: predictions
-- Stores all credit analysis predictions
-- Maps to the AI model input/output
-- =====================================================
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Input fields (sent to AI model)
    nama_usaha VARCHAR(255),
    usia_pemilik INTEGER,
    lama_usaha INTEGER,
    pendapatan_bulanan BIGINT,
    pengeluaran_bulanan BIGINT,
    jumlah_pinjaman BIGINT,
    riwayat_telat_bayar INTEGER DEFAULT 0,
    jumlah_tanggungan INTEGER DEFAULT 0,
    
    -- Output fields (from AI model)
    score INTEGER,
    status VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: audit_log
-- Tracks user actions for security and compliance
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- Seed data (optional, for development)
-- =====================================================
-- Insert a demo user (password: demo123, hashed with bcrypt)
INSERT INTO users (name, email, password) 
VALUES ('Budi Santoso', 'budi@umkm.com', '$2b$10$dummyhashfordemopurposesonlynotreal')
ON CONFLICT (email) DO NOTHING;
