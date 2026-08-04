/* ===================== Leaf Aid — Supabase config =====================
   Safe to expose publicly: this is the "anon" key, designed for
   front-end use. Real protection comes from Row Level Security
   policies set up on the `scans` table and storage bucket.
========================================================================= */

const SUPABASE_URL = 'https://nlkhqvnvetdfnzferzlh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sa2hxdm52ZXRkZm56ZmVyemxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MTE1NDMsImV4cCI6MjEwMTM4NzU0M30.C5jjQBNp8A1xd94sxdOAhgcr1a9aQ3usPIPW0qwlwd4';

// `supabase` here is the global object injected by the CDN script tag
// (https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2) — we create our
// own client and store it under a different name to avoid confusion.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
