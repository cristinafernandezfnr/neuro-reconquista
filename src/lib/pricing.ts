export interface PricingConfig {
  layer1Price: string
  layer1Features: string[]
  layer1Cta: string
  proMonthly: string
  proAnnual: string
  proFeatures: string[]
  proCta: string
}

const DEFAULT_PRICING: PricingConfig = {
  layer1Price: 'R$ 97,00',
  layer1Features: [
    '35 dias de protocolo diário guiado',
    'Tarefas gamificadas com XP',
    'Visualizações e exercícios psicológicos',
    'Acesso vitalício ao conteúdo',
  ],
  layer1Cta: 'Quero meu acesso',
  proMonthly: 'R$ 19,90/mês',
  proAnnual: 'R$ 149,00/ano',
  proFeatures: [
    '6 módulos avançados de sedução',
    'Coach Cristina disponível 24h',
    'Psicologia masculina e feminina',
    'Scripts de abordagem reais',
    'Cancelamento a qualquer momento',
  ],
  proCta: 'Começar por R$ 19,90/mês →',
}

export function getPricing(): PricingConfig {
  try {
    const saved = localStorage.getItem('nr_admin_pricing')
    if (saved) return { ...DEFAULT_PRICING, ...JSON.parse(saved) }
  } catch { /* ignore */ }
  return DEFAULT_PRICING
}

export function savePricing(config: Partial<PricingConfig>): void {
  try {
    const current = getPricing()
    localStorage.setItem('nr_admin_pricing', JSON.stringify({ ...current, ...config }))
  } catch { /* ignore */ }
}
