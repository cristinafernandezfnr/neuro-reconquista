import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export const SOSButton: React.FC = () => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/sos')}
      className="fixed top-4 right-4 z-30 flex items-center gap-1.5 bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-pill text-xs font-medium hover:bg-primary/20 transition-colors"
    >
      <AlertTriangle size={12} />
      SOS
    </button>
  )
}
