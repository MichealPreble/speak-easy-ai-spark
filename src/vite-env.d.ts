
/// <reference types="vite/client" />

// Explicitly define the ImportMetaEnv interface for TypeScript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly DEV: boolean;
}

// Extend the ImportMeta interface
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
