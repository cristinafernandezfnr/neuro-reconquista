import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPricing } from '../../lib/pricing'
import { isCoachEnabled } from '../../lib/coachFlag'

const PRO_URL = import.meta.env.VITE_STRIPE_CHECKOUT_PRO_URL || ''
const L1_URL = import.meta.env.VITE_STRIPE_CHECKOUT_LAYER1_URL || ''

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 60,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '20px', backgroundColor: 'rgba(0,0,0,0.85)',
}
const card: React.CSSProperties = {
  width: '100%', maxWidth: 360,
  backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24,
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <div className="space-y-2 mb-5">
      {features.map((f, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-success font-bold flex-shrink-0 mt-0.5">✓</span>
          <span className="text-text-secondary text-sm">{f}</span>
        </div>
      ))}
    </div>
  )
}

function TrustLine() {
  return (
    <p className="text-text-muted text-xs text-center mb-5 leading-relaxed">
      ✓ Acesso imediato &nbsp;·&nbsp; ✓ Cancele quando quiser &nbsp;·&nbsp; ✓ Garantia 7 dias
    </p>
  )
}

// ── Pro Upgrade Modal ─────────────────────────────────────────────────────────
interface UpgradeModalProps {
  open: boolean
  onClose: () => void
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const pricing = getPricing()
  const coachEnabled = isCoachEnabled()
  const proFeatures = coachEnabled
    ? pricing.proFeatures
    : pricing.proFeatures.filter(f => !f.toLowerCase().includes('cristina') && !f.includes('24h'))

  const handleCTA = () => {
    if (PRO_URL) {
      window.open(PRO_URL, '_blank')
    } else {
      alert('Configure VITE_STRIPE_CHECKOUT_PRO_URL no .env para ativar pagamentos.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div
            style={{ ...card, border: '1px solid #e0a020' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          >
            <div className="text-center mb-5">
              <p style={{ fontSize: 48 }}>👑</p>
              <h2 className="font-display text-xl font-extrabold text-white mt-2 mb-1">
                Neuro Reconquista Pro
              </h2>
              <p className="font-display text-3xl font-bold mt-2" style={{ color: '#e0a020' }}>
                {pricing.proMonthly}
              </p>
            </div>

            <FeatureList features={proFeatures} />
            <TrustLine />

            <button
              onClick={handleCTA}
              className="w-full py-4 rounded-full font-bold text-white text-base mb-3"
              style={{ backgroundColor: '#c8102e', boxShadow: '0 0 24px rgba(200,16,46,0.35)' }}
            >
              Assinar agora por {pricing.proMonthly} →
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm text-text-muted"
            >
              Agora não
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Layer 1 Upgrade Modal ─────────────────────────────────────────────────────
export function UpgradeLayer1Modal({ open, onClose }: UpgradeModalProps) {
  const pricing = getPricing()

  const handleCTA = () => {
    if (L1_URL) {
      window.open(L1_URL, '_blank')
    } else {
      alert('Configure VITE_STRIPE_CHECKOUT_LAYER1_URL no .env para ativar pagamentos.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div
            style={{ ...card, border: '1px solid #c8102e' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          >
            <div className="text-center mb-5">
              <p style={{ fontSize: 48 }}>📋</p>
              <h2 className="font-display text-xl font-extrabold text-white mt-2 mb-1">
                Protocolo da Reconquista
              </h2>
              <p className="font-display text-3xl font-bold mt-2 text-primary">
                {pricing.layer1Price}
              </p>
              <p className="text-text-muted text-xs mt-1">Acesso vitalício</p>
            </div>

            <FeatureList features={pricing.layer1Features} />

            <p className="text-text-muted text-xs text-center mb-5 leading-relaxed">
              ✓ Acesso imediato &nbsp;·&nbsp; ✓ Pagamento único &nbsp;·&nbsp; ✓ Garantia 7 dias
            </p>

            <button
              onClick={handleCTA}
              className="w-full py-4 rounded-full font-bold text-white text-base mb-3"
              style={{ backgroundColor: '#c8102e', boxShadow: '0 0 24px rgba(200,16,46,0.35)' }}
            >
              Adquirir acesso por {pricing.layer1Price} →
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm text-text-muted"
            >
              Agora não
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
