import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const body = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Read config from DB
    const { data: settings } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['hotmart_hottok', 'app_url'])

    const cfg = Object.fromEntries((settings || []).map((r: { key: string; value: string }) => [r.key, r.value]))
    const APP_URL = cfg['app_url'] || Deno.env.get('APP_URL') || 'https://neuroreconquista.com'
    const HOTMART_HOTTOK = cfg['hotmart_hottok'] || Deno.env.get('HOTMART_HOTTOK') || ''

    // Hotmart signature validation via X-Hotmart-Hottok header
    if (HOTMART_HOTTOK) {
      const hottok = req.headers.get('X-Hotmart-Hottok') || ''
      if (hottok !== HOTMART_HOTTOK) {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    // Hotmart webhook structure: body.data.buyer or body.buyer
    const email: string | undefined =
      body.data?.buyer?.email || body.buyer?.email
    if (!email) return new Response('Missing email', { status: 400 })

    const customerName: string =
      body.data?.buyer?.name || body.buyer?.name || ''

    const event: string = body.event || ''

    // ── Purchase approved / complete ──────────────────────────────────────
    if (event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE') {
      // 1. Find or create auth user
      const { data: existingRow } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      let userId: string

      if (!existingRow) {
        // Create auth user (email already confirmed) + let trigger create users row
        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: customerName },
        })
        if (createErr) throw createErr
        userId = created.user.id

        // Upsert users row (trigger may not have populated it yet)
        await supabase.from('users').upsert({
          id: userId,
          email,
          full_name: customerName,
          protocol_access: true,
          pro_access: true,
          protocol_source: 'hotmart',
        })

        // Send magic link so user can access the app immediately
        const { data: linkData } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: { redirectTo: APP_URL },
        })
        console.log('Magic link generated for new user:', email, linkData?.properties?.action_link)
      } else {
        userId = existingRow.id
        // Existing user — upgrade access
        await supabase.from('users').update({
          protocol_access: true,
          pro_access: true,
          protocol_source: 'hotmart',
          banned: false,
          ban_reason: null,
        }).eq('id', userId)
      }

      // 2. Record payment
      await supabase.from('payments').insert({
        user_id: userId,
        source: 'hotmart',
        external_id: body.data?.purchase?.transaction || body.purchase?.transaction,
        status: 'approved',
        amount: body.data?.purchase?.price?.value || body.purchase?.price?.value || 0,
        currency: body.data?.purchase?.price?.currency_code || 'BRL',
      })

      return new Response('OK', { status: 200 })
    }

    // ── Refund / Reversal ─────────────────────────────────────────────────
    if (event === 'PURCHASE_REFUNDED' || event === 'PURCHASE_REVERSED') {
      await supabase.from('users').update({
        protocol_access: false,
        pro_access: false,
      }).eq('email', email)

      return new Response('OK', { status: 200 })
    }

    // ── Chargeback ────────────────────────────────────────────────────────
    if (event === 'PURCHASE_CHARGEBACK') {
      await supabase.from('users').update({
        protocol_access: false,
        pro_access: false,
        banned: true,
        ban_reason: 'chargeback_hotmart',
      }).eq('email', email)

      return new Response('OK', { status: 200 })
    }

    // Unknown event — acknowledge
    console.log('Hotmart unknown event:', event, body)
    return new Response('Event ignored', { status: 200 })
  } catch (err) {
    console.error('Hotmart webhook error:', err)
    return new Response(`Error: ${err}`, { status: 500 })
  }
})
