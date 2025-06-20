import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ypnfvkrkffcuhpxjuuuu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbmZ2a3JrZmZjdWhweGp1dXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MzAzMzIsImV4cCI6MjA2NjAwNjMzMn0.0mqDFAHn3afllqH4CdJIpf9z-R2v33aelFIojjZ9Xag'

export const supabase = createClient(supabaseUrl, supabaseKey)
