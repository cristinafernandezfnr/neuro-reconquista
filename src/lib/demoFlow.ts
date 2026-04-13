// Demo/onboarding flow flags stored in localStorage

export const FLOW_KEYS = {
  anameseDone: 'nr_anamnese_done',
  onboardingDone: 'nr_onboarding_done',
  gender: 'nr_gender',
  anamneseResult: 'nr_anamnese_result',
  anamneseProgress: 'nr_anamnese_progress',
} as const

export const isAnamneseDone = () => localStorage.getItem(FLOW_KEYS.anameseDone) === 'true'
export const isOnboardingDone = () => localStorage.getItem(FLOW_KEYS.onboardingDone) === 'true'

export const setAnamneseDone = (score: number, nivel: number) => {
  localStorage.setItem(FLOW_KEYS.anameseDone, 'true')
  localStorage.setItem(FLOW_KEYS.anamneseResult, JSON.stringify({ score, nivel }))
}

export const setOnboardingDone = (userGender: string, targetGender: string) => {
  localStorage.setItem(FLOW_KEYS.onboardingDone, 'true')
  localStorage.setItem(FLOW_KEYS.gender, JSON.stringify({ user_gender: userGender, target_gender: targetGender }))
}

export const clearDemoFlow = () => {
  Object.values(FLOW_KEYS).forEach(k => localStorage.removeItem(k))
}

/** Returns the next route based on completed steps */
export const getNextDemoRoute = (): string => {
  if (!isAnamneseDone()) return '/anamnese'
  if (!isOnboardingDone()) return '/onboarding'
  return '/home'
}
