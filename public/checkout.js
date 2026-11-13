/* Progressive mobile checkout presentation. Existing form fields and submit handler remain authoritative. */
(() => {
  'use strict'
  const init = () => {
    if (window.matchMedia && !window.matchMedia('(max-width: 760px)').matches) return
    const form = document.getElementById('donateForm')
    if (!form || form.dataset.wizardReady === '1') return
    form.dataset.wizardReady = '1'
    const direct = [...form.children]
    const paymentStart = direct.findIndex(node => node.matches?.('label') && /metode pembayaran/i.test(node.textContent || ''))
    const submit = document.getElementById('submitBtn')
    if (paymentStart < 0 || !submit) return

    const stepper = document.createElement('div')
    stepper.className = 'checkout-steps'
    stepper.setAttribute('aria-label', 'Tahapan donasi')
    stepper.innerHTML = '<div class="checkout-step active" data-step-indicator="1"><span class="step-dot">1</span><span>Amount</span></div><div class="checkout-step" data-step-indicator="2"><span class="step-dot">2</span><span>Payment</span></div><div class="checkout-step" data-step-indicator="3"><span class="step-dot">3</span><span>Finish</span></div>'
    form.prepend(stepper)

    const stepOne = document.createElement('section')
    stepOne.className = 'checkout-step-panel'
    stepOne.dataset.checkoutStep = '1'
    stepOne.innerHTML = '<h2 class="checkout-panel-title">Donation checkout</h2><p class="checkout-panel-desc">Pilih nominal dukungan dan lengkapi detail donasi.</p>'
    const stepTwo = document.createElement('section')
    stepTwo.className = 'checkout-step-panel'
    stepTwo.dataset.checkoutStep = '2'
    stepTwo.hidden = true
    stepTwo.innerHTML = '<h2 class="checkout-panel-title">Payment method</h2><p class="checkout-panel-desc">Pilih metode pembayaran yang tersedia untuk transaksi ini.</p>'

    const before = direct.slice(0, paymentStart)
    const after = direct.slice(paymentStart)
    before.forEach(node => stepOne.appendChild(node))
    after.forEach(node => stepTwo.appendChild(node))
    const actions = document.createElement('div')
    actions.className = 'checkout-step-actions'
    const back = document.createElement('button')
    back.type = 'button'; back.className = 'neo-btn checkout-back'; back.textContent = 'Kembali'
    const next = document.createElement('button')
    next.type = 'button'; next.className = 'neo-btn'; next.innerHTML = 'Lanjut pembayaran <span aria-hidden="true">→</span>'
    actions.append(back, next)
    stepOne.appendChild(actions)
    const paymentActions = document.createElement('div')
    paymentActions.className = 'checkout-step-actions'
    const backPayment = document.createElement('button')
    backPayment.type = 'button'; backPayment.className = 'neo-btn checkout-back'; backPayment.textContent = 'Kembali'
    paymentActions.append(backPayment, submit)
    stepTwo.appendChild(paymentActions)
    form.append(stepOne, stepTwo)

    const showStep = (step) => {
      stepOne.hidden = step !== 1
      stepTwo.hidden = step !== 2
      stepper.querySelectorAll('[data-step-indicator]').forEach(item => {
        const number = Number(item.dataset.stepIndicator)
        item.classList.toggle('active', number === step)
        item.classList.toggle('done', number < step)
      })
      if (step === 2) stepTwo.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const validAmount = () => {
      const amount = document.getElementById('amount')
      const value = Number(amount?.value)
      if (!Number.isFinite(value) || value < 2000 || !Number.isInteger(value)) {
        amount?.focus()
        amount?.setCustomValidity('Minimum donasi Rp2.000 dan harus berupa angka bulat.')
        amount?.reportValidity()
        amount?.addEventListener('input', () => amount.setCustomValidity(''), { once: true })
        return false
      }
      return true
    }
    next.addEventListener('click', () => { if (validAmount()) showStep(2) })
    back.addEventListener('click', () => showStep(1))
    backPayment.addEventListener('click', () => showStep(1))
    form.addEventListener('submit', () => { stepper.dataset.submitting = 'true' })
    document.getElementById('qrSection')?.prepend(Object.assign(document.createElement('div'), {
      className: 'checkout-steps checkout-finish-steps',
      innerHTML: '<div class="checkout-step done"><span class="step-dot">✓</span><span>Amount</span></div><div class="checkout-step done"><span class="step-dot">✓</span><span>Payment</span></div><div class="checkout-step active"><span class="step-dot">3</span><span>Finish</span></div>'
    }))
    showStep(1)
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true })
  else init()
})()
