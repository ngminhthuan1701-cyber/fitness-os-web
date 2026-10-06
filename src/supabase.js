import { createClient } from '@supabase/supabase-js';

// URL và Key từ dự án Supabase của bạn
export const SUPABASE_URL = 'https://faegzwbdpybcmkskanzb.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_VERqStnuwSYBlJ8ssyb8tA_uTpdeXMs';

let supabaseClient = null;

export function getSupabaseClient(customKey) {
  const anonKey = customKey || localStorage.getItem('supabase_anon_key') || DEFAULT_SUPABASE_KEY;
  if (!anonKey) return null;
  if (!supabaseClient || supabaseClient._anonKey !== anonKey) {
    supabaseClient = createClient(SUPABASE_URL, anonKey);
    supabaseClient._anonKey = anonKey;
  }
  return supabaseClient;
}

// Kiểm tra kết nối tới Supabase
export async function testConnection(anonKey) {
  const client = getSupabaseClient(anonKey);
  if (!client) throw new Error('Chưa có Supabase Anon Key');
  const { data, error } = await client.from('fitness_data').select('id').limit(1);
  if (error) throw error;
  return true;
}

// Lưu dữ liệu vào Supabase Cloud
export async function saveToSupabase(fitnessData, anonKey) {
  const client = getSupabaseClient(anonKey);
  if (!client) throw new Error('Chưa có Supabase Key.');

  const payload = {
    id: 'main',
    data: fitnessData,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await client
    .from('fitness_data')
    .upsert(payload, { onConflict: 'id' });

  if (error) throw error;
  return payload.updated_at;
}

// Tải dữ liệu từ Supabase Cloud
export async function loadFromSupabase(anonKey) {
  const client = getSupabaseClient(anonKey);
  if (!client) throw new Error('Chưa có Supabase Key.');

  const { data, error } = await client
    .from('fitness_data')
    .select('data, updated_at')
    .eq('id', 'main')
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.data) {
    throw new Error('Chưa có dữ liệu nào trên Supabase. Bạn hãy bấm "Lưu lên Supabase Cloud" trước.');
  }

  return {
    fitnessData: data.data,
    updatedAt: data.updated_at
  };
}
