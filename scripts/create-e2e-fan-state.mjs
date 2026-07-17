import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const appUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const outputPath = resolve(process.env.E2E_FAN_STORAGE_STATE ?? ".auth/fan.json");
const email = process.env.E2E_FAN_EMAIL ?? "fan@aetheris.ai";
const password = process.env.E2E_FAN_PASSWORD ?? "testing123";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

if (error || !data.session) {
  throw error ?? new Error("Fan authentication did not return a session.");
}

const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
if (!projectRef) throw new Error("Could not derive the Supabase project reference.");

// Matches @supabase/ssr createBrowserClient's default base64url cookie format.
const value = `base64-${Buffer.from(JSON.stringify(data.session)).toString("base64url")}`;
const browser = await chromium.launch();
const context = await browser.newContext();

try {
  await context.addCookies([
    {
      name: `sb-${projectRef}-auth-token`,
      value,
      url: appUrl,
      httpOnly: false,
      sameSite: "Lax",
    },
  ]);
  await mkdir(dirname(outputPath), { recursive: true });
  await context.storageState({ path: outputPath });
  console.log(`Fan storage state created at ${outputPath}`);
} finally {
  await context.close();
  await browser.close();
}
