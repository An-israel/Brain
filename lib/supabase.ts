import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Browser client
export function createBrowserSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server/API client with service role
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey)
}

export type Message = {
  id?: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  context_tags?: string[]
  importance_score?: number
  created_at?: string
}

export type Task = {
  id?: string
  title: string
  description?: string
  area?: 'personal_brand' | 'skryve' | 'nexus' | 'emc' | 'church' | 'personal'
  assigned_to?: string
  due_date?: string
  status?: 'todo' | 'in_progress' | 'done' | 'blocked'
  priority?: 'critical' | 'high' | 'medium' | 'low'
  created_at?: string
  completed_at?: string
}

export type Finance = {
  id?: string
  type: 'income' | 'expense' | 'debt_payment' | 'debt'
  amount: number
  description?: string
  category?: string
  date?: string
  month?: string
  notes?: string
}

export type Opportunity = {
  id?: string
  title: string
  type?: string
  description?: string
  source_url?: string
  confidence_score?: number
  verified?: boolean
  recommended?: boolean
  action_required?: string
  relevance_tags?: string[]
  discovered_at?: string
  status?: string
}

export type ContentEntry = {
  id?: string
  platform: string
  content_type?: string
  pillar?: string
  title?: string
  script_notes?: string
  scheduled_date?: string
  status?: string
  published_url?: string
}

// Save a message to the conversations table
export async function saveMessage(message: Message) {
  const client = createServerSupabaseClient()
  const { data, error } = await client.from('conversations').insert(message).select().single()
  if (error) console.error('Error saving message:', error)
  return data
}

// Get recent messages for a session
export async function getSessionMessages(sessionId: string, limit = 40) {
  const client = createServerSupabaseClient()
  const { data, error } = await client
    .from('conversations')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) console.error('Error fetching messages:', error)
  return data || []
}

// Get brain context
export async function getBrainContext() {
  const client = createServerSupabaseClient()
  const { data, error } = await client
    .from('brain_context')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) console.error('Error fetching brain context:', error)
  return data
}

// Get open tasks
export async function getOpenTasks() {
  const client = createServerSupabaseClient()
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .in('status', ['todo', 'in_progress', 'blocked'])
    .order('priority', { ascending: true })
    .limit(20)
  if (error) console.error('Error fetching tasks:', error)
  return data || []
}

// Get all tasks
export async function getAllTasks() {
  const client = createServerSupabaseClient()
  const { data, error } = await client
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error('Error fetching tasks:', error)
  return data || []
}

// Get finances
export async function getFinances() {
  const client = createServerSupabaseClient()
  const { data, error } = await client
    .from('finances')
    .select('*')
    .order('date', { ascending: false })
  if (error) console.error('Error fetching finances:', error)
  return data || []
}

// Get opportunities
export async function getOpportunities() {
  const client = createServerSupabaseClient()
  const { data, error } = await client
    .from('opportunities')
    .select('*')
    .order('discovered_at', { ascending: false })
  if (error) console.error('Error fetching opportunities:', error)
  return data || []
}

// Get content calendar
export async function getContentCalendar() {
  const client = createServerSupabaseClient()
  const { data, error } = await client
    .from('content_calendar')
    .select('*')
    .order('scheduled_date', { ascending: true })
  if (error) console.error('Error fetching content calendar:', error)
  return data || []
}

// Update brain context
export async function updateBrainContext(context: Record<string, unknown>) {
  const client = createServerSupabaseClient()
  const existing = await getBrainContext()
  if (existing?.id) {
    const { error } = await client
      .from('brain_context')
      .update({ ...context, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) console.error('Error updating brain context:', error)
  } else {
    const { error } = await client.from('brain_context').insert(context)
    if (error) console.error('Error inserting brain context:', error)
  }
}
