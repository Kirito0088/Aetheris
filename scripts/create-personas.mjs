import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const personas = [
  { email: "vol@aetheris.ai", password: "testing123" },
  { email: "admin@aetheris.ai", password: "testing123" },
];

async function seedAuthPersonas() {
  console.log("Seeding auth personas...");
  for (const p of personas) {
    console.log(`\nProcessing ${p.email}...`);
    
    // Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error(`Error listing users:`, listError.message);
      continue;
    }

    const userExists = users.some((u) => u.email === p.email);
    
    if (!userExists) {
      console.log(`User ${p.email} not found. Creating user...`);
      const { data, error } = await supabase.auth.admin.createUser({
        email: p.email,
        password: p.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`Failed to create ${p.email}:`, error.message);
      } else {
        console.log(`Successfully created ${p.email} (ID: ${data.user?.id})`);
      }
    } else {
      console.log(`User ${p.email} already exists in Supabase Auth.`);
    }
  }
  console.log("\nDone seeding auth personas.");
}

seedAuthPersonas();
