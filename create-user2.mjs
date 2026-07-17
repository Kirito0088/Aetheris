import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iqgbdrbzccbbtlyjccnu.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function setupTestUsers() {
  const { data: user1, error: err1 } = await supabase.auth.admin.createUser({
    email: 'admin@aetheris.ai',
    password: 'testing123',
    email_confirm: true
  })
  
  if (user1) {
    await supabase.from('profiles').insert({
      id: user1.user.id,
      email: 'admin@aetheris.ai',
      role: 'venue_admin'
    })
    console.log("Venue Admin setup complete")
  }

  const { data: user2, error: err2 } = await supabase.auth.admin.createUser({
    email: 'vol@aetheris.ai',
    password: 'testing123',
    email_confirm: true
  })
  
  if (user2) {
    await supabase.from('profiles').insert({
      id: user2.user.id,
      email: 'vol@aetheris.ai',
      role: 'volunteer'
    })
    console.log("Volunteer setup complete")
  }
}

setupTestUsers()
