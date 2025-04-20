
// Vercel serverless function for health checks
import { healthCheck } from '../src/api/health';

export default async function handler(req, res) {
  try {
    const health = await healthCheck();
    res.status(health.status === 'ok' ? 200 : 500)
       .json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
}
