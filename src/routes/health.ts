
import { healthCheck } from "@/api/health";

export async function handleHealthRequest() {
  try {
    const health = await healthCheck();
    return new Response(JSON.stringify(health), {
      status: health.status === "ok" ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
