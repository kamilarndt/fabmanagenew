import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'
type Skin = 'default' | 'bordered'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [skin, setSkin] = useState<Skin>('default')

  useEffect(() => {
    // Sprawdź zapisany motyw lub preferencje systemu
    const savedTheme = localStorage.getItem('theme') as Theme
    const savedSkin = localStorage.getItem('skin') as Skin
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    const initialSkin = savedSkin || 'default'
    
    setTheme(initialTheme)
    setSkin(initialSkin)
    applySettings(initialTheme, initialSkin)

    // Nasłuchuj zmian preferencji systemu
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        applySettings(newTheme, skin)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const applySettings = (newTheme: Theme, newSkin: Skin) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    document.documentElement.setAttribute('data-skin', newSkin)
    localStorage.setItem('theme', newTheme)
    localStorage.setItem('skin', newSkin)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    applySettings(newTheme, skin)
  }

  const toggleSkin = () => {
    const newSkin = skin === 'default' ? 'bordered' : 'default'
    setSkin(newSkin)
    applySettings(theme, newSkin)
  }

      return (
    <div className="d-flex gap-2">
      <button
        onClick={toggleTheme}
        className="btn btn-outline-secondary d-flex align-items-center"
        aria-label={`Przełącz na tryb ${theme === 'dark' ? 'jasny' : 'ciemny'}`}
        title={`Aktualny tryb: ${theme === 'dark' ? 'ciemny' : 'jasny'}`}
      >
        <i className={`ri-${theme === 'dark' ? 'sun' : 'moon'}-line me-1`}></i>
        <span className="d-none d-lg-inline">
          {theme === 'dark' ? 'Jasny' : 'Ciemny'}
        </span>
      </button>
      
      <button
        onClick={toggleSkin}
        className="btn btn-outline-secondary d-flex align-items-center"
        aria-label={`Przełącz na skin ${skin === 'default' ? 'bordered' : 'default'}`}
        title={`Aktualny skin: ${skin === 'default' ? 'domyślny' : 'bordered'}`}
      >
        <i className={`ri-${skin === 'default' ? 'layout' : 'border'}-line me-1`}></i>
        <span className="d-none d-lg-inline">
          {skin === 'default' ? 'Bordered' : 'Default'}
        </span>
      </button>
    </div>
  )
}
