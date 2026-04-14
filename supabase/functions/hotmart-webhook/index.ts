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
    const APP_URL = (cfg['app_url'] || Deno.env.get('APP_URL') || 'https://neuroreconquista.com').trim()
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
        // New user — invite sends email automatically with one-click access link
        const { data: invited, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(email, {
          data: { full_name: customerName },
          redirectTo: APP_URL,
        })
        if (inviteErr) throw inviteErr
        userId = invited.user.id

        // Upsert users row with access (trigger may not have run yet)
        await supabase.from('users').upsert({
          id: userId,
          email,
          name: customerName,
          protocol_access: true,
          pro_access: true,
          protocol_source: 'hotmart',
        }, { onConflict: 'id' })
      } else {
        userId = existingRow.id
        // Existing user — upgrade access and send new magic link
        await supabase.from('users').update({
          protocol_access: true,
          pro_access: true,
          protocol_source: 'hotmart',
          banned: false,
          ban_reason: null,
        }).eq('id', userId)

        // Send magic link to existing user
        await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: { redirectTo: APP_URL },
        })
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
