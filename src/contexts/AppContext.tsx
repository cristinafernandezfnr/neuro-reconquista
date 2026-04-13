import React, { createContext, useContext, useState, useEffect } from 'react'
import { Lang } from '../types'
import { getLang, setLang as setLangI18n } from '../data/i18n'

interface AppContextType {
  language: Lang
  setLanguage: (lang: Lang) => void
}

const AppContext = createContext<AppContextType>({
  language: 'pt',
  setLanguage: () => {},
})

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Lang>(getLang())

  const setLanguage = (lang: Lang) => {
    setLangI18n(lang)
    setLanguageState(lang)
  }

  useEffect(() => {
    // Detect browser language on first visit
    const stored = localStorage.getItem('nr_lang')
    if (!stored) {
      const browserLang = navigator.language.slice(0, 2)
      const supported: Lang[] = ['pt', 'es', 'en']
      const detected = supported.includes(browserLang as Lang) ? (browserLang as Lang) : 'pt'
      setLanguage(detected)
    }
  }, [])

  return (
    <AppContext.Provider value={{ language, setLanguage }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
