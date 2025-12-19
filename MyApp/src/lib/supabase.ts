import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sdctjuqgewnlkfwmqvwx.supabase.co'; // 너의 URL
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkY3RqdXFnZXdubGtmd21xdnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDgxNzcsImV4cCI6MjA3OTg4NDE3N30.GIocQ5pz77A58VY3T8-fIewZNuV4S0Elso5YcAuvDPg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true, // 앱 재실행해도 세션 유지
    autoRefreshToken: true, // 토큰 자동 갱신
    detectSessionInUrl: false, // RN에선 보통 false
  },
});
