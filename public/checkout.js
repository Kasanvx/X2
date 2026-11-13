/* Mobile-first three-step checkout. Keeps the existing form and payment handler authoritative. */
(() => {
  'use strict'

  const initCheckout = () => {
    const form = document.getElementById('donateForm')
    if (!form || form.dataset.wizardReady === '1') return

    const children = [...form.children]
    const paymentLabelIndex = children.findIndex(node =>
      node.matches?.('label') && /metode\s+pembayaran/i.test(node.textContent || '')
    )
    const submit = document.getElementById('submitBtn')
    if (paymentLabelIndex < 0 || !submit) return

    // The payment picker is the only payment-specific block. Amount, presets,
    // reactions and message remain in step 1 so amount validation never targets
    // a hidden field (the previous implementation accidentally hid the amount).
    const paymentLabel = children[paymentLabelIndex]
    const paymentPicker = children[paymentLabelIndex + 1]
    if (!paymentPicker || !paymentPicker.classList.contains('payment-picker')) return

    const stepper = document.createElement('nav')
    stepper.className = 'checkout-steps'
    stepper.setAttribute('aria-label', 'Tahapan donasi')
    stepper.innerHTML = `
      <div class="checkout-step active" data-step-indicator="1"><span class="step-dot">1</span><span>Nominal</span></div>
      <div class="checkout-step" data-step-indicator="2"><span class="step-dot">2</span><span>Pembayaran</span></div>
      <div class="checkout-step" data-step-indicator="3"><span class="step-dot">3</span><span>Selesai</span></div>`

    const stepOne = document.createElement('section')
    stepOne.className = 'checkout-step-panel'
    stepOne.dataset.checkoutStep = '1'
    stepOne.innerHTML = '<div class="checkout-panel-heading"><span class="checkout-eyebrow">LANGKAH 1 DARI 3</span><h2 class="checkout-panel-title">Tentukan dukunganmu</h2><p class="checkout-panel-desc">Pilih nominal dan isi detail donasi sebelum memilih pembayaran.</p></div>'

    const stepTwo = document.createElement('section')
    stepTwo.className = 'checkout-step-panel'
    stepTwo.dataset.checkoutStep = '2'
    stepTwo.hidden = true
    stepTwo.innerHTML = '<div class="checkout-panel-heading"><span class="checkout-eyebrow">LANGKAH 2 DARI 3</span><h2 class="checkout-panel-title">Pilih pembayaran</h2><p class="checkout-panel-desc">Gunakan metode pembayaran yang tersedia.</p></div>'

    const next = document.createElement('button')
    next.type = 'button'
    next.className = 'neo-btn checkout-next'
    next.innerHTML = 'Lanjut ke pembayaran <span aria-hidden="true">→</span>'

    const back = document.createElement('button')
    back.type = 'button'
    back.className = 'neo-btn checkout-back'
    back.textContent = 'Kembali'

    const actionsOne = document.createElement('div')
    actionsOne.className = 'checkout-step-actions'
    actionsOne.append(next)

    const actionsTwo = document.createElement('div')
    actionsTwo.className = 'checkout-step-actions'
    actionsTwo.append(back, submit)

    // Move the original nodes; do not clone controls or detach their handlers.
    children.forEach((node, index) => {
      if (node === submit || node === paymentLabel || node === paymentPicker) return
      stepOne.appendChild(node)
    })
    stepTwo.append(paymentLabel, paymentPicker)
    stepOne.appendChild(actionsOne)
    stepTwo.append(actionsTwo)

    form.replaceChildren(stepper, stepOne, stepTwo)
    form.dataset.wizardReady = '1'

    const showStep = step => {
      stepOne.hidden = step !== 1
      stepTwo.hidden = step !== 2
      stepper.querySelectorAll('[data-step-indicator]').forEach(item => {
        const number = Number(item.dataset.stepIndicator)
        item.classList.toggle('active', number === step)
        item.classList.toggle('done', number < step)
        if (number === step) item.setAttribute('aria-current', 'step')
        else item.removeAttribute('aria-current')
      })
      if (step === 2) stepTwo.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else stepOne.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const validateStepOne = () => {
      const amount = document.getElementById('amount')
      const value = Number(amount?.value)
      if (!Number.isFinite(value) || value < 2000 || !Number.isInteger(value)) {
        amount?.setCustomValidity('Minimum donasi Rp2.000 dan harus berupa angka bulat.')
        amount?.reportValidity()
        amount?.focus()
        return false
      }
      amount.setCustomValidity('')
      return true
    }

    document.getElementById('amount')?.addEventListener('input', event => {
      event.currentTarget.setCustomValidity('')
    })

    next.addEventListener('click', event => {
      event.preventDefault()
      if (validateStepOne()) showStep(2)
    })
    back.addEventListener('click', event => {
      event.preventDefault()
      showStep(1)
    })

    // Mark the final stage when the existing app reveals its payment QR/result.
    const markFinished = () => {
      const qr = document.getElementById('qrSection')
      const result = document.getElementById('resultSection')
      if (!qr || (!qr.classList.contains('hidden') && qr.offsetParent !== null) ||
          (result && !result.classList.contains('hidden'))) {
        stepper.querySelectorAll('[data-step-indicator]').forEach(item => {
          item.classList.toggle('done', Number(item.dataset.stepIndicator) < 3)
          item.classList.toggle('active', Number(item.dataset.stepIndicator) === 3)
        })
        stepper.querySelector('[data-step-indicator="3"]')?.setAttribute('aria-current', 'step')
      }
    }
    const observer = new MutationObserver(markFinished)
    ;['qrSection', 'resultSection'].forEach(id => {
      const target = document.getElementById(id)
      if (target) observer.observe(target, { attributes: true, attributeFilter: ['class'] })
    })

    showStep(1)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCheckout, { once: true })
  else initCheckout()
})()
