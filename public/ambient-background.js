(() => {
  'use strict'
  const canvas = document.getElementById('kaxelAmbientCanvas')
  if (!canvas) return
  const context = canvas.getContext('2d', { alpha: true })
  if (!context) return

  let width = 0
  let height = 0
  let frame = 0
  let particles = []
  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const resize = () => {
    width = window.innerWidth
    height = window.innerHeight
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    const count = Math.max(24, Math.min(90, Math.floor(width * height / 14000)))
    particles = Array.from({ length: count }, () => makeParticle(true))
    if (reducedMotion) drawStatic()
  }

  const makeParticle = initial => ({
    x: Math.random() * width,
    y: initial ? Math.random() * height : height + 10,
    radius: Math.random() * 1.6 + 0.6,
    velocity: Math.random() * 0.25 + 0.08,
    phase: Math.random() * Math.PI * 2,
    alpha: Math.random() * 0.4 + 0.15
  })

  const draw = animate => {
    context.clearRect(0, 0, width, height)
    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index]
      if (animate) {
        particle.y -= particle.velocity
        particle.phase += 0.01
        particle.x += Math.sin(particle.phase) * 0.25
        if (particle.y < -10) {
          particles[index] = makeParticle(false)
          continue
        }
      }
      context.fillStyle = `rgba(180,210,255,${particle.alpha})`
      context.beginPath()
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      context.fill()
    }
  }

  const drawStatic = () => draw(false)
  const animate = () => {
    if (document.hidden || reducedMotion) return
    draw(true)
    frame = window.requestAnimationFrame(animate)
  }
  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame)
    frame = 0
  }
  const start = () => {
    if (!reducedMotion && !document.hidden && !frame) frame = window.requestAnimationFrame(animate)
  }

  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else start()
  })
  resize()
  start()
})()
