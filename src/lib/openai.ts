import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

export const openai = apiKey && !apiKey.includes('placeholder')
  ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  : null

export const chatWithCristina = async (
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string
): Promise<string> => {
  if (!openai) {
    await new Promise(r => setTimeout(r, 1200))
    return getDemoResponse(messages[messages.length - 1]?.content || '')
  }

  let attempt = 0
  while (attempt < 2) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 500,
        temperature: 0.8,
      })
      clearTimeout(timeout)
      return completion.choices[0]?.message?.content || 'Não consegui processar sua mensagem. Tente novamente.'
    } catch (err: unknown) {
      attempt++
      if (attempt >= 2) {
        const e = err as { status?: number }
        if (e?.status === 429) return 'Muitas mensagens em pouco tempo. Aguarde um momento e tente novamente.'
        return 'Ocorreu um erro na conexão. Tente novamente em instantes.'
      }
      await new Promise(r => setTimeout(r, 1500))
    }
  }
  return 'Erro inesperado. Tente novamente.'
}

const getDemoResponse = (msg: string): string => {
  const lower = msg.toLowerCase()
  if (lower.includes('saudade') || lower.includes('miss') || lower.includes('extraño')) {
    return 'Saudade é a prova de que o vínculo foi real. Mas saudade não precisa de ação imediata — precisa de direção. O que você pode fazer AGORA que te faça orgulhar amanhã? 💪'
  }
  if (lower.includes('mensagem') || lower.includes('ligar') || lower.includes('contato') || lower.includes('message')) {
    return 'Antes de enviar qualquer mensagem, me responde uma coisa: o que você ESPERA que aconteça quando ela receber? Se a resposta for "que ela responda bem" — você ainda está buscando validação externa. E isso afasta. O silêncio estratégico nesse momento vale mais que qualquer palavra. 🤫'
  }
  if (lower.includes('não sei') || lower.includes("don't know") || lower.includes('desistir') || lower.includes('não vale')) {
    return 'Não saber é um lugar honesto. Me conta mais — o que exatamente está te confundindo? Quanto mais específico você for, mais precisa eu consigo ser na minha orientação. 🎯'
  }
  if (lower.includes('evoluindo') || lower.includes('melhorando') || lower.includes('improving')) {
    return 'Isso é TUDO! 🔥 Evolução genuína é o que cria atração real — não técnicas, não jogos. Quando você muda de verdade, as pessoas ao redor percebem antes de você perceber. O que mudou especificamente?'
  }
  if (lower.includes('ajuda') || lower.includes('help') || lower.includes('ansied') || lower.includes('ansioso')) {
    return 'Estou aqui. Me conta com mais detalhes o que está acontecendo — contexto, quanto tempo faz, o que você já tentou. Quanto mais eu souber, melhor posso te orientar. 💙'
  }
  return 'Entendo o que você está sentindo. Me conta mais sobre a situação — preciso entender o contexto completo para te dar uma orientação realmente útil. O que aconteceu exatamente? 🎯'
}
