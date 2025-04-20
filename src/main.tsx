import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { handleHealthRequest } from "./routes/health";

// Health check route
window.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('/api/health')) {
    event.respondWith(handleHealthRequest());
  }
});

createRoot(document.getElementById("root")!).render(<App />);
