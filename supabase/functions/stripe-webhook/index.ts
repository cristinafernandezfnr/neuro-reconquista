import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    // Verify Stripe signature (simplified — use stripe lib for production)
    if (!sig || !webhookSecret) {
      return new Response('Missing signature', { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const email = event.data?.object?.customer_email ||
                  event.data?.object?.billing_details?.email

    if (!email) return new Response('Missing email', { status: 400 })

    const { data: user } = await supabase.from('users').select('id').eq('email', email).single()
    if (!user) return new Response('User not found', { status: 404 })

    if (event.type === 'checkout.session.completed') {
      const plan = event.data.object.metadata?.plan || 'protocol'
      const updates = plan === 'pro'
        ? { pro_access: true, pro_stripe_sub_id: event.data.object.subscription }
        : { protocol_access: true, protocol_source: 'stripe', protocol_stripe_sub_id: event.data.object.subscription }

      await supabase.from('users').update(updates).eq('id', user.id)
      await supabase.from('payments').insert({
        user_id: user.id,
        source: 'stripe',
        external_id: event.data.object.id,
        status: 'approved',
        amount: (event.data.object.amount_total || 0) / 100,
        currency: (event.data.object.currency || 'brl').toUpperCase(),
      })
    }

    if (event.type === 'customer.subscription.deleted') {
      await supabase.from('users').update({
        protocol_access: false,
        pro_access: false,
      }).eq('id', user.id)
    }

    if (event.type === 'charge.dispute.created') {
      await supabase.from('users').update({
        protocol_access: false,
        pro_access: false,
        banned: true,
        ban_reason: 'chargeback_stripe',
      }).eq('id', user.id)
    }

    return new Response('OK', { status: 200 })
  } catch (err) {
    return new Response(`Error: ${err}`, { status: 500 })
  }
})
