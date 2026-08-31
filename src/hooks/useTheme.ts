import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const readTheme = (): Theme => {
  const stored = window.localStorage.getItem('gramlab-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('gramlab-theme', theme)
  }, [theme])
  return { theme, toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light') }
}
