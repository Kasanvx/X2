(() => {
  'use strict'
  const STORAGE_KEY = 'kaxel_theme_preference_v2'
  const root = document.body
  if (!root) return

  const readPreference = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('kaxel_theme_preference_v1')
      if (saved === 'dark' || saved === 'light') return saved
    } catch { /* Storage may be disabled; default to light. */ }
    return 'dark'
  }

  const applyTheme = (theme) => {
    const selected = theme === 'dark' ? 'dark' : 'light'
    root.dataset.theme = selected
    const button = document.querySelector('.theme-toggle')
    if (!button) return
    const dark = selected === 'dark'
    button.innerHTML = dark
      ? '<span aria-hidden="true">☀</span><span>Light mode</span>'
      : '<span aria-hidden="true">☾</span><span>Dark mode</span>'
    button.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap')
    button.setAttribute('aria-pressed', String(dark))
  }

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'theme-toggle'
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* Theme still works for this page view. */ }
    applyTheme(next)
  })
  root.appendChild(button)
  applyTheme(readPreference())
})()
