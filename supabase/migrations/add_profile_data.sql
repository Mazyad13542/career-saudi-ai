-- Migration: add profile_data JSONB column to profiles
-- Run this in Supabase SQL Editor if your database was created before this column was added
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}';
