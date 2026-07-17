import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iqgbdrbzccbbtlyjccnu.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('*')
  console.log('Profiles:', data)
  console.log('Error:', error)
}

checkProfiles()
