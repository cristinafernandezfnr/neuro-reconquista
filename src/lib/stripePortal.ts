import { supabase, isDemoSupabase } from './supabase'

export async function openStripePortal(): Promise<void> {
  if (isDemoSupabase()) {
    alert('Portal Stripe disponível apenas com conta real e assinatura ativa.')
    return
  }
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Não autenticado')
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_url: window.location.origin + '/profile' }),
      }
    )
    const data = await response.json()
    if (data.url) { window.location.href = data.url }
    else throw new Error(data.error || 'Erro ao abrir portal')
  } catch (error) {
    console.error('Stripe portal error:', error)
    alert('Não foi possível abrir o portal. Tente novamente.')
  }
}
