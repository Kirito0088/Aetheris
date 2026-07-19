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

const VOLUNTEER_NAMES = [
  "Sofia Martinez", "Mateo Ricci", "Elena Geller", "Yuki Tanaka", "Marcus Aurelius",
  "James Holden", "Amos Burton", "Naomi Nagata", "Alex Kamal", "Chrisjen Avasarala",
  "Bobbie Draper", "Camina Drummer", "Klaes Ashford", "Fred Johnson", "Anderson Dawes"
];

const ZONES = ['north-gate', 'south-gate', 'sector-104', 'vip-lounge', 'concourse-east'];

const getRandomZone = () => ZONES[Math.floor(Math.random() * ZONES.length)];

async function seedDemoData() {
  console.log("Seeding demo data...");

  // 1. Create Volunteers
  console.log("Creating volunteers...");
  const volunteerIds = [];
  
  for (let i = 0; i < VOLUNTEER_NAMES.length; i++) {
    const name = VOLUNTEER_NAMES[i];
    const email = `vol${i + 1}@aetheris.ai`;
    
    // Create user
    let { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    let user = users?.find(u => u.email === email);
    
    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: "testing123",
        email_confirm: true,
        app_metadata: { user_role: "volunteer" },
        user_metadata: { full_name: name }
      });
      if (error) {
        console.error(`Error creating volunteer ${email}:`, error.message);
        continue;
      }
      user = data.user;
    }
    
    volunteerIds.push(user.id);

    // Upsert volunteer_status
    await supabase.from("volunteer_status").upsert({
      id: user.id,
      current_zone_id: getRandomZone(),
      assignment: ["Queue Control", "Ticket Assistance", "Directional Guide", "Info Desk"][Math.floor(Math.random() * 4)],
      battery: Math.floor(Math.random() * 60) + 40,
      radio_channel: `Ch ${Math.floor(Math.random() * 5) + 1} (Ops)`,
      status: ["available", "busy", "dispatched"][Math.floor(Math.random() * 3)],
      workload: ["low", "optimal", "high"][Math.floor(Math.random() * 3)],
      last_active: new Date().toISOString(),
      ai_recommended: Math.random() > 0.7,
      rec_reason: "AI matched language and proximity."
    }, { onConflict: "id" });
  }

  // 2. Create Incidents
  console.log("Creating incidents...");
  const incidentTitles = ["Crowd Congestion", "Medical Emergency", "Broken Turnstile", "Lost Child", "Spill on Concourse"];
  for (let i = 0; i < 20; i++) {
    await supabase.from("incidents").insert({
      title: incidentTitles[Math.floor(Math.random() * incidentTitles.length)],
      description: "Auto-generated demo incident.",
      status: ["open", "assigned", "resolved"][Math.floor(Math.random() * 3)],
      priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      location_zone_id: getRandomZone(),
      reported_at: new Date(Date.now() - Math.random() * 10000000).toISOString()
    });
  }

  // 3. Create Tasks
  console.log("Creating tasks...");
  const taskTitles = ["Assist at Gate", "Clean Spill", "Escort VIP", "Replace Radio Battery", "Direct Traffic"];
  for (let i = 0; i < 20; i++) {
    const status = ["pending", "active", "completed"][Math.floor(Math.random() * 3)];
    await supabase.from("tasks").insert({
      title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
      description: "Auto-generated demo task.",
      type: ["incident", "assistance", "logistics"][Math.floor(Math.random() * 3)],
      priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      status: status,
      assigned_to: status !== "pending" ? volunteerIds[Math.floor(Math.random() * volunteerIds.length)] : null,
      created_at: new Date(Date.now() - Math.random() * 10000000).toISOString()
    });
  }

  // 4. Create Fan Data
  console.log("Creating fan data...");
  const fanEmail = "fan@aetheris.ai";
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const fanUser = users?.find(u => u.email === fanEmail);
  
  if (fanUser) {
    // Generate ticket
    await supabase.from("tickets").upsert({
      user_id: fanUser.id,
      match_name: 'Mexico vs Argentina',
      match_date: '2026-07-04',
      kickoff_time: new Date(Date.now() + 45 * 60000).toISOString(),
      gate: 'Gate C',
      sector: '104',
      "row": 'G',
      seat: '22',
      status: 'valid'
    }, { onConflict: "user_id, match_name" }); // Wait, tickets pk is id. Might need a cleanup first or just insert.
    // Let's just delete existing tickets for fan and insert new
    await supabase.from("tickets").delete().eq("user_id", fanUser.id);
    await supabase.from("tickets").insert({
      user_id: fanUser.id,
      match_name: 'Mexico vs Argentina',
      match_date: '2026-07-04',
      kickoff_time: new Date(Date.now() + 45 * 60000).toISOString(),
      gate: 'Gate C',
      sector: '104',
      "row": 'G',
      seat: '22',
      status: 'valid'
    });

    // Generate alerts
    await supabase.from("alerts").delete().eq("target_user_id", fanUser.id);
    await supabase.from("alerts").insert({
      title: 'Smart Route Available',
      description: 'Gate C is currently busy. Routing you through Gate D will save you 12 minutes.',
      type: 'routing',
      action_label: 'Show Route',
      target_user_id: fanUser.id
    });
  }

  console.log("Demo data seeded successfully.");
}

seedDemoData().catch(console.error);
