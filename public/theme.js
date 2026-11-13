(() => {
  const STORAGE_KEY = 'kaxel_theme_preference_v1'
  const root = document.body
  const readPreference = () => {
    try { return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light' }
    catch { return 'light' }
  }
  const applyTheme = (theme) => {
    root.dataset.theme = theme
    const button = document.querySelector('.theme-toggle')
    if (button) {
      const dark = theme === 'dark'
      button.innerHTML = dark
        ? '<span aria-hidden="true">☀</span><span>Mode terang</span>'
        : '<span aria-hidden="true">☾</span><span>Mode gelap</span>'
      button.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap')
      button.setAttribute('aria-pressed', String(dark))
    }
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
