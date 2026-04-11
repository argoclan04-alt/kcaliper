import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vsbgqnevkpremfzvphir.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYmdxbmV2a3ByZW1menZwaGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDY2ODAsImV4cCI6MjA5MTA4MjY4MH0.Rbr2h86jF-npYDQGEfaM6j8xjuzaGndoLAwe5PefuXQ'
const supabase = createClient(supabaseUrl, supabaseKey)

async function signUpAdmin() {
  const email = 'admin@kcaliper.ai'
  const password = 'KcaliperAdmin2026!' // Temporary password

  console.log(`Intentando crear usuario ${email}...`)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: 'Valdi',
        role: 'super_admin'
      }
    }
  })

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log('Usuario creado con éxito:', data.user?.id)
  console.log('Ahora intenta entrar con este email y la contraseña: KcaliperAdmin2026!')
}

signUpAdmin()
