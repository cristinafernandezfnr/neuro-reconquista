// Deploy: supabase functions deploy stripe-portal
// Requires env vars: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Configure portal at: https://dashboard.stripe.com/settings/billing/portal

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

    const { data: profile } = await supabase.from('users').select('pro_stripe_sub_id, protocol_stripe_sub_id').eq('id', user.id).single()

    let customerId: string | null = null
    if (profile?.pro_stripe_sub_id) {
      const sub = await stripe.subscriptions.retrieve(profile.pro_stripe_sub_id)
      customerId = sub.customer as string
    } else if (profile?.protocol_stripe_sub_id) {
      const sub = await stripe.subscriptions.retrieve(profile.protocol_stripe_sub_id)
      customerId = sub.customer as string
    }

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { supabase_user_id: user.id } })
      customerId = customer.id
    }

    const { return_url } = await req.json().catch(() => ({ return_url: null }))
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: return_url || `${req.headers.get('origin')}/profile`,
    })

    return new Response(JSON.stringify({ url: session.url }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
