
import { supabase, isSupabaseConfigured, testSupabaseConnection } from "../lib/supabase";
import { startTimestamp } from "../utils/uptime";

// Enhanced function to check Supabase connection with better error handling
async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return "not_configured";
  }

  try {
    const connectionTest = await testSupabaseConnection();
    return connectionTest.success ? "ok" : "error";
  } catch {
    return "error";
  }
}

// Health check handler
export async function healthCheck() {
  const supabaseStatus = await checkSupabaseConnection();
  const uptime = Date.now() - startTimestamp;

  return {
    status: supabaseStatus === "ok" ? "ok" : "degraded",
    supabase: supabaseStatus,
    api: "ok", // API is responding if this code runs
    uptime,
    timestamp: new Date().toISOString()
  };
}
