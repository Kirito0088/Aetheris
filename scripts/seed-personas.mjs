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
  { email: "vol@aetheris.ai", password: "testing123", role: "volunteer" },
  { email: "admin@aetheris.ai", password: "testing123", role: "venue_operator" },
  { email: "fan@aetheris.ai", password: "testing123", role: "fan" },
];

async function seedPersonas() {
  let failed = false;
  console.log("Seeding personas...");
  for (const p of personas) {
    console.log(`\nProcessing ${p.email}...`);
    // 1. Create or get user
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error(`Error listing users:`, listError.message);
      failed = true;
      continue;
    }

    let user = users.find(u => u.email === p.email);
    
    if (!user) {
       console.log(`User ${p.email} not found, creating...`);
       const { data, error } = await supabase.auth.admin.createUser({
         email: p.email,
         password: p.password,
         email_confirm: true,
         app_metadata: { user_role: p.role },
       });
       if (error) {
         console.error(`Error creating user ${p.email}:`, error.message);
         failed = true;
         continue;
       }
       user = data.user;
       console.log(`Created user ${p.email} with ID ${user?.id}`);
    } else {
        console.log(`User ${p.email} exists with ID ${user.id}`);
    }

    if (!user) continue;

    // 2. Keep existing users and the profile table aligned with the enum used
    // by RLS and middleware. This is required for repeatable E2E personas.
    const { error: metadataError } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, user_role: p.role },
    });
    if (metadataError) {
      console.error(`Error updating app metadata for ${p.email}:`, metadataError.message);
      failed = true;
      continue;
    }

    // 3. Upsert role into profiles table
    console.log(`Upserting role '${p.role}' for user ${p.email}...`);
    const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        role: p.role,
        full_name: p.email.split('@')[0]
    }, {
        onConflict: 'id'
    });

    if (profileError) {
        console.error(`Error upserting profile for ${p.email}:`, profileError.message);
        failed = true;
    } else {
        console.log(`Successfully set role '${p.role}' for ${p.email}.`);
    }
  }
  console.log("\nDone.");
  if (failed) process.exitCode = 1;
}

seedPersonas();
