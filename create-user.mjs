import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iqgbdrbzccbbtlyjccnu.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function createTestUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'testing@aetheris.ai',
    password: 'testing123',
    email_confirm: true
  })
  if (error) {
    console.error('Error creating user:', error)
  } else {
    console.log('User created:', data)
  }
}

createTestUser()
