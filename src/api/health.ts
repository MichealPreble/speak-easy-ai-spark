
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { startTimestamp } from "../utils/uptime";

// Simple function to check Supabase connection
async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return "not_configured";
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .limit(1);

    if (error) {
      return "error";
    }
    return "ok";
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
