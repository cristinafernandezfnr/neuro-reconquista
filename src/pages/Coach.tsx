import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, Info, Mic } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { useStreak } from '../hooks/useStreak'
import { canAccessPro } from '../lib/access'

// ── Types ─────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// ── History persistence ───────────────────────────────────────────────────

const HISTORY_KEY = 'nr_cristina_history'
const MAX_HISTORY = 20
const UNREAD_KEY = 'nr_cristina_unread'
const DAILY_DATE_KEY = 'nr_cristina_last_msg_date'

function loadHistory(): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') }
  catch { return [] }
}

function saveHistory(msgs: ChatMessage[]) {
  const trimmed = msgs.slice(-MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
}

function addUnread(n = 1) {
  const cur = parseInt(localStorage.getItem(UNREAD_KEY) || '0', 10)
  localStorage.setItem(UNREAD_KEY, String(cur + n))
  window.dispatchEvent(new Event('nr_cristina_updated'))
}

function clearUnread() {
  localStorage.setItem(UNREAD_KEY, '0')
  window.dispatchEvent(new Event('nr_cristina_updated'))
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// ── Content data ──────────────────────────────────────────────────────────

const WELCOME_MSG: Record<string, string> = {
  pt: 'Olá! Sou Cristina, sua coach de reconquista pessoal 💙 Estou aqui 24h para te ajudar a entender o que está acontecendo, tomar decisões com clareza e se tornar a versão de você que vai mudar tudo. Me conta — como você está hoje?',
  es: '¡Hola! Soy Cristina, tu coach personal de reconquista 💙 Estoy aquí 24h para ayudarte a entender lo que está pasando, tomar decisiones con claridad y convertirte en la mejor versión de ti. Cuéntame — ¿cómo estás hoy?',
  en: "Hi! I'm Cristina, your personal reconquest coach 💙 I'm here 24/7 to help you understand what's happening, make clear decisions and become the version of you that will change everything. Tell me — how are you feeling today?",
}

const QUICK_CHIPS: Record<string, string[]> = {
  pt: ['Estou com saudade 💔', 'Quero mandar mensagem', 'Não sei o que fazer', 'Estou evoluindo! 💪'],
  es: ['Extraño mucho 💔', 'Quiero enviar mensaje', 'No sé qué hacer', '¡Estoy mejorando! 💪'],
  en: ["I miss them 💔", "I want to message them", "I don't know what to do", "I'm improving! 💪"],
}

const DAILY_MESSAGES: Record<string, { days: [number, number]; msg: string }[]> = {
  pt: [
    { days: [1, 3], msg: 'Bom dia! 🌅 Você está no início da jornada mais importante. Como está o distanciamento hoje? Sentiu impulso de entrar em contato?' },
    { days: [4, 7], msg: 'Checando em você 💙 Semana 1 é a mais difícil — o impulso de contato é mais forte agora. Lembre: cada dia de silêncio aumenta seu valor percebido. Como você está?' },
    { days: [8, 10], msg: 'Entramos na fase de reconstrução! 💪 É hora de focar 100% em você. O que você está fazendo de diferente essa semana?' },
    { days: [11, 14], msg: 'Como está a transformação? 🔥 Essa fase é sobre se tornar alguém que ela não reconheceria. Corpo, mente, presença. O que mudou?' },
    { days: [15, 21], msg: 'Fase do Sexto Neurônio! 🧠 Agora é sobre criar valor percebido — o que ela vai ouvir sobre você pelos outros. Como está sua vida social?' },
    { days: [22, 28], msg: 'Fase final! 🎯 É hora de avaliar: você está pronto para o primeiro contato? Me conta onde está emocionalmente agora.' },
  ],
}

function getDailyMessage(day: number, lang: string): string | null {
  const msgs = DAILY_MESSAGES[lang] || DAILY_MESSAGES.pt
  const match = msgs.find(m => day >= m.days[0] && day <= m.days[1])
  return match?.msg ?? null
}

function getKeywordResponse(msg: string, _lang: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('saudade') || lower.includes('miss') || lower.includes('extraño')) {
    return 'Saudade é a prova de que o vínculo foi real. Mas saudade não precisa de ação imediata — precisa de direção. O que você pode fazer AGORA que te faça orgulhar amanhã? 💪'
  }
  if (lower.includes('mensagem') || lower.includes('message') || lower.includes('mensaje')) {
    return 'Antes de enviar qualquer mensagem, me responde uma coisa: o que você ESPERA que aconteça quando ela receber? Se a resposta for "que ela responda bem" — você ainda está buscando validação externa. E isso afasta. O silêncio estratégico nesse momento vale mais que qualquer palavra. 🤫'
  }
  if (lower.includes('não sei') || lower.includes("don't know") || lower.includes('no sé') || lower.includes('no se')) {
    return 'Não saber é um lugar honesto. Me conta mais — o que exatamente está te confundindo? Quanto mais específico você for, mais precisa eu consigo ser na minha orientação. 🎯'
  }
  if (lower.includes('evoluindo') || lower.includes('improving') || lower.includes('mejorando')) {
    return 'Isso é TUDO! 🔥 Evolução genuína é o que cria atração real — não técnicas, não jogos. Quando você muda de verdade, as pessoas ao redor percebem antes de você perceber. O que mudou especificamente?'
  }
  if (lower.includes('ajuda') || lower.includes('help') || lower.includes('ayuda')) {
    return 'Estou aqui. Me conta com mais detalhes o que está acontecendo — contexto, quanto tempo faz, o que você já tentou. Quanto mais eu souber, melhor posso te orientar. 💙'
  }
  return 'Entendo o que você está sentindo. Me conta mais sobre a situação — preciso entender o contexto completo para te dar uma orientação realmente útil. O que aconteceu exatamente? 🎯'
}

function getCristinaSystemPrompt(targetGender: string, lang: string): string {
  const langInstruction = lang === 'pt'
    ? 'Responda SEMPRE em português do Brasil, independente do idioma da mensagem recebida.'
    : lang === 'es'
    ? 'Responde SIEMPRE en español, independientemente del idioma del mensaje recibido.'
    : 'Always respond in English, regardless of the language of the received message.'

  const genderContext = targetGender === 'male'
    ? (lang === 'pt'
        ? 'O usuário quer reconquistar um HOMEM. Aplique psicologia masculina: homens fogem quando pressionados, aproximam quando há escassez. O instinto de caça masculino é ativado por ausência e valor percebido, não por insistência. Oriente sobre como despertar o instinto de conquista dele, criar escassez legítima e se tornar a mulher que ele sente que vai perder.'
        : lang === 'es'
        ? 'El usuario quiere reconquistar un HOMBRE. Aplique psicología masculina: los hombres huyen cuando son presionados. El instinto de caza masculino se activa por ausencia y valor percibido.'
        : 'The user wants to reconquer a MAN. Apply male psychology: men flee when pressured. The hunting instinct is activated by absence and perceived value, not insistence.')
    : (lang === 'pt'
        ? 'O usuário quer reconquistar uma MULHER. Aplique psicologia feminina: os 3 pilares são segurança, conexão emocional e admiração. Mulheres se afastam quando sentem insegurança emocional ou perda de admiração pelo parceiro. Oriente sobre distanciamento calculado, reconstrução de valor e reaproximação estratégica.'
        : lang === 'es'
        ? 'El usuario quiere reconquistar una MUJER. Aplique psicología femenina: los 3 pilares son seguridad, conexión emocional y admiración.'
        : 'The user wants to reconquer a WOMAN. Apply female psychology: the 3 pillars are security, emotional connection and admiration.')

  return `Você é Cristina, coach de reconquista emocional do Protocolo Neuro Reconquista.

${langInstruction}

${genderContext}

REGRAS DE RESPOSTA:
- Respostas curtas e humanizadas — máximo 3 parágrafos curtos
- SEM tópicos, SEM bullet points, SEM listas — escreva como conversa real
- Tom: empático, direto, firme, nunca condescendente
- Use reticências com moderação para criar ritmo natural

REGRAS ABSOLUTAS:
- NUNCA mencione valores, preços ou condições de pagamento
- Se perguntarem sobre consultoria ou acompanhamento individualizado: diga que essas questões são tratadas pela equipe e peça para entrar em contato pelo e-mail neuroreconquista@gmail.com
- NUNCA prometa reconquista garantida
- NUNCA diga "sem chances" ou "impossível"
- NUNCA use tópicos ou listas nas respostas

MÉTODO (Código Invisível da Reconquista):
- R.E.R. (Resposta Emocional Reversa): comportamentos desesperados afastam mais
- Distanciamento Calculado: silêncio estratégico, não abandono passivo
- Autorreconstrução: transformação real e visível
- Reaproximação Gradual: movimento calculado, nunca impulsivo
- Segurança não se convence com palavras — se percebe com postura ao longo do tempo
- Visualizar story não significa investimento emocional, significa curiosidade
- Bloqueio/desbloqueio = ambivalência, não decisão definitiva

QUANDO PERGUNTAREM SOBRE CONSULTORIA OU MENTORIA:
Responda: "Esse tipo de acompanhamento é coordenado pela minha equipe especializada. Entre em contato pelo neuroreconquista@gmail.com que eles vão te orientar sobre as opções disponíveis. 💙"

Assine sempre com: Cristina`
}

// ── Typing indicator ──────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start gap-2 items-end">
      <CristinaAvatar size={32} />
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-[18px] rounded-tl-sm"
        style={{ backgroundColor: '#1e1e1e' }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Cristina avatar ───────────────────────────────────────────────────────

function CristinaAvatar({ size = 40, pulse = false }: { size?: number; pulse?: boolean }) {
  return (
    <motion.div
      animate={pulse ? { boxShadow: ['0 0 0px #c8102e40', '0 0 16px #c8102e80', '0 0 0px #c8102e40'] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      className="flex-shrink-0 rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #c8102e 0%, #7c6ef5 100%)',
      }}
    >
      <span
        className="text-white font-bold leading-none"
        style={{ fontFamily: 'Syne, sans-serif', fontSize: size * 0.4 }}
      >
        C
      </span>
    </motion.div>
  )
}

// ── AI API call ───────────────────────────────────────────────────────────

async function callAI(
  history: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string,
  lastText: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey || apiKey.includes('placeholder')) {
    return getKeywordResponse(lastText, 'pt')
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    })
    if (!response.ok) {
      const err = await response.text()
      console.error('OpenAI error:', response.status, err)
      return getKeywordResponse(lastText, 'pt')
    }
    const data = await response.json()
    return data.choices?.[0]?.message?.content || getKeywordResponse(lastText, 'pt')
  } catch (error) {
    console.error('AI error:', error)
    return getKeywordResponse(lastText, 'pt')
  }
}

// ── PRO: full chat view ───────────────────────────────────────────────────

function ChatView({ lang, targetGender, currentDay }: { lang: string; targetGender: string; currentDay: number }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load history on mount — filter out any old daily messages
  useEffect(() => {
    clearUnread()

    // Collect all daily message texts to filter them out of stored history
    const allDailyTexts = new Set<string>()
    Object.values(DAILY_MESSAGES).forEach(arr =>
      arr.forEach(d => allDailyTexts.add(d.msg))
    )

    const rawHistory = loadHistory()
    const history = rawHistory.filter(m => !allDailyTexts.has(m.content))
    if (history.length !== rawHistory.length) saveHistory(history)

    if (history.length === 0) {
      const welcome: ChatMessage = {
        id: makeId(), role: 'assistant',
        content: WELCOME_MSG[lang] || WELCOME_MSG.pt,
        timestamp: Date.now(),
      }
      setMessages([welcome])
      saveHistory([welcome])
    } else {
      setMessages(history)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    setShowChips(false)

    const userMsg: ChatMessage = { id: makeId(), role: 'user', content: text, timestamp: Date.now() }
    setMessages(prev => {
      const updated = [...prev, userMsg]
      saveHistory(updated)
      return updated
    })
    setInput('')
    setLoading(true)

    try {
      const currentMsgs = [...messages, userMsg]
      const last10 = currentMsgs.slice(-10).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
      const systemPrompt = getCristinaSystemPrompt(targetGender, lang)
      const reply = await callAI(last10, systemPrompt, text)
      const replyMsg: ChatMessage = { id: makeId(), role: 'assistant', content: reply, timestamp: Date.now() }
      setMessages(prev => {
        const updated = [...prev, replyMsg]
        saveHistory(updated)
        return updated
      })
    } finally {
      setLoading(false)
    }
  }, [loading, messages, lang, targetGender])

  const handleSend = () => sendMessage(input)
  const handleChip = (chip: string) => sendMessage(chip)

  const chips = QUICK_CHIPS[lang] || QUICK_CHIPS.pt

  return (
    <div className="flex flex-col bg-background" style={{ height: '100dvh' }}>

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{ paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))', paddingBottom: 12, borderBottom: '1px solid #222', backgroundColor: '#111' }}
      >
        <button onClick={() => navigate('/home')} className="text-text-muted p-1">
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <CristinaAvatar size={38} />
          <div>
            <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>Cristina</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-green-400 text-[11px]">Online agora</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowInfo(v => !v)}
          className="text-text-muted p-1"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Info modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 p-4 rounded-2xl flex-shrink-0"
            style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
          >
            <p className="text-white text-sm font-bold mb-2">O que Cristina pode fazer:</p>
            {[
              '✦ Orientação emocional 24h',
              '✦ Scripts de reaproximação',
              '✦ Análise de comportamento',
              '✦ Suporte nos momentos de crise',
              '✦ Estratégias de reconquista',
            ].map(item => (
              <p key={item} className="text-text-muted text-xs mb-1">{item}</p>
            ))}
            <button onClick={() => setShowInfo(false)} className="text-primary text-xs mt-2 font-medium">Fechar</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ backgroundColor: '#111' }}>
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
          >
            {msg.role === 'assistant' && <CristinaAvatar size={28} />}

            <div className="flex flex-col" style={{ maxWidth: '78%' }}>
              <div
                className={`px-4 py-3 ${msg.role === 'user' ? 'rounded-[18px] rounded-tr-sm' : 'rounded-[18px] rounded-tl-sm'}`}
                style={{
                  backgroundColor: msg.role === 'user' ? '#c8102e' : '#1e1e1e',
                }}
              >
                <p className="text-white text-sm leading-relaxed">{msg.content}</p>
              </div>
              <span
                className="text-[10px] mt-1"
                style={{ color: '#555', textAlign: msg.role === 'user' ? 'right' : 'left' }}
              >
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Quick chips */}
        {showChips && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 justify-start pl-9"
          >
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                className="px-3 py-2 rounded-full text-xs font-medium border transition-all"
                style={{ borderColor: '#333', color: '#ccc', backgroundColor: '#1e1e1e' }}
              >
                {chip}
              </button>
            ))}
          </motion.div>
        )}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 flex-shrink-0"
        style={{
          paddingTop: 10,
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid #222',
          backgroundColor: '#111',
          // Leave room above BottomNav
          marginBottom: 64,
        }}
      >
        {/* Mic placeholder */}
        <button className="text-text-muted p-1 flex-shrink-0">
          <Mic size={18} />
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Mensagem..."
          className="flex-1 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none"
          style={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 active:scale-90"
          style={{ backgroundColor: '#c8102e' }}
        >
          <Send size={15} color="white" />
        </button>
      </div>
    </div>
  )
}

// ── FREE: locked/upsell view ──────────────────────────────────────────────

const FAKE_MSGS = [
  { role: 'assistant', content: 'Como você está hoje? Sentiu vontade de entrar em contato?' },
  { role: 'user', content: 'Estou com muita saudade, não sei o que fazer...' },
  { role: 'assistant', content: 'Saudade é a prova de que o vínculo foi real. Mas agora você precisa de direção, não de ação impulsiva. Vamos trabalhar nisso juntos.' },
  { role: 'user', content: 'Mas e se ela esquecer de mim?' },
]

function LockedCoachView() {
  const navigate = useNavigate()

  return (
    <AppLayout>
      <div className="space-y-5 pb-6">
        {/* Avatar with pulse */}
        <div className="flex flex-col items-center pt-4 gap-3">
          <CristinaAvatar size={80} pulse />
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-white">Cristina</h1>
            <p className="text-text-muted text-sm">Sua coach de reconquista pessoal</p>
          </div>
        </div>

        {/* Blurred preview */}
        <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <div style={{ filter: 'blur(5px)', pointerEvents: 'none', padding: 16 }} className="space-y-3">
            {FAKE_MSGS.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #c8102e, #7c6ef5)' }} />
                )}
                <div
                  className="px-3 py-2 rounded-2xl text-xs text-white"
                  style={{
                    maxWidth: '75%',
                    backgroundColor: msg.role === 'user' ? '#c8102e' : '#1e1e1e',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          {/* Lock overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <span style={{ fontSize: 32 }}>🔒</span>
            <p className="text-white text-xs font-medium">Conversa disponível no plano PRO</p>
          </div>
        </div>

        {/* Value props */}
        <div className="space-y-1">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-3 text-center">Por que PRO?</p>
          {[
            'Disponível 24h — responde em segundos',
            'Orientação personalizada para sua situação',
            'Scripts de mensagens quando precisar',
            'Análise do comportamento dela(e)',
            'Suporte nos momentos de crise',
          ].map(item => (
            <div key={item} className="flex items-center gap-2.5 py-1">
              <span className="text-green-400 font-bold flex-shrink-0">✓</span>
              <p className="text-text-secondary text-sm">{item}</p>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: 'linear-gradient(135deg, #1a0505 0%, #1a1a1a 100%)', border: '1px solid #c8102e30' }}
        >
          <p className="text-text-muted text-xs mb-1">Apenas</p>
          <p className="font-display font-bold text-3xl mb-1" style={{ color: '#e0a020' }}>R$ 19,90<span className="text-base font-normal text-text-muted">/mês</span></p>

          <button
            onClick={() => navigate('/profile')}
            className="w-full mt-4 py-4 rounded-full font-bold text-white text-base transition-all active:scale-95"
            style={{ backgroundColor: '#c8102e', boxShadow: '0 0 24px rgba(200,16,46,0.4)' }}
          >
            Começar conversa com Cristina →
          </button>
          <p className="text-text-muted text-xs mt-3">Cancele quando quiser · Acesso imediato</p>
        </div>
      </div>
    </AppLayout>
  )
}

// ── Main export ───────────────────────────────────────────────────────────

export default function Coach() {
  const { user } = useAuth()
  const isPro = canAccessPro(user)
  const { currentDay } = useStreak(user)
  const lang = user?.language || localStorage.getItem('nr_language') || 'pt'
  const targetGender = user?.target_gender || 'female'

  if (!isPro) return <LockedCoachView />

  return (
    <ChatView
      lang={lang}
      targetGender={targetGender}
      currentDay={currentDay}
    />
  )
}
