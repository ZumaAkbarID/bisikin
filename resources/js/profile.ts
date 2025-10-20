/// <reference lib="dom" />

console.log('Profile module initialized 🌿')

// === Event bindings ===
document
  .querySelectorAll('input[name="mode"]')
  .forEach((i) => i.addEventListener('change', handleModeChange))
document.getElementById('message-form')?.addEventListener('submit', handleSubmit)

handleModeChange() // initial state

// === Toast Notification ===
function showToast(message: string, type = 'success') {
  const toast = document.getElementById('toast')
  const toastMessage = document.getElementById('toast-message')

  if (!toast || !toastMessage) return
  toastMessage.textContent = message
  toast.classList.add('show')

  if (type === 'error') toast.style.background = 'rgba(239, 68, 68, 0.9)'
  else toast.style.background = 'rgba(163, 201, 199, 0.9)'

  setTimeout(() => toast.classList.remove('show'), 3000)
}

// === Mode toggle (Anonim / Blak-blakan) ===
function handleModeChange() {
  const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]')
  const clueField = document.getElementById('clue-field')!
  const nameField = document.getElementById('name-field')!

  const selected = Array.from(modeInputs).find((i) => i.checked)?.value

  if (selected === 'anonymous') {
    clueField.classList.remove('hidden')
    nameField.classList.add('hidden')
  } else {
    clueField.classList.add('hidden')
    nameField.classList.remove('hidden')
  }
}

// === Handle form submission ===
async function handleSubmit(e: Event) {
  e.preventDefault()

  const form = document.getElementById('message-form') as HTMLFormElement
  const messageInput = document.getElementById('message-input') as HTMLTextAreaElement
  const clueInput = document.getElementById('clue-input') as HTMLInputElement
  const nameInput = document.getElementById('name-input') as HTMLInputElement
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement
  const submitText = document.getElementById('submit-text')!
  const submitSpinner = document.getElementById('submit-spinner')!

  const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]')
  const selected = Array.from(modeInputs).find((i) => i.checked)?.value
  const isAnonymous = selected === 'anonymous'

  const message = messageInput.value.trim()
  const clue = clueInput.value.trim()
  const sender = nameInput.value.trim()

  // === Validasi ===
  if (!message) {
    showToast('Pesan tidak boleh kosong!', 'error')
    return
  }
  if (!isAnonymous && !sender) {
    showToast('Nama harus diisi untuk mode blak-blakan!', 'error')
    return
  }

  // === Disable all inputs saat kirim ===
  const allInputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input, textarea, button'
  )
  allInputs.forEach((el) => (el.disabled = true))

  // Spinner on
  submitSpinner.classList.remove('hidden')
  submitSpinner.classList.add('inline-block')
  submitText.innerText = 'Mengirim...'

  try {
    // Simulasi kirim (nanti bisa diganti fetch API)
    await new Promise((r) => setTimeout(r, 1500))

    // Reset form
    messageInput.value = ''
    clueInput.value = ''
    nameInput.value = ''
    handleModeChange()

    showToast('Pesan berhasil dikirim! 🌿')
  } catch (err) {
    console.error(err)
    showToast('Gagal mengirim pesan, coba lagi.', 'error')
  } finally {
    // Balikin semua input
    allInputs.forEach((el) => (el.disabled = false))
    submitText.innerText = 'Kirim Pesan'
    submitSpinner.classList.add('hidden')
    submitSpinner.classList.remove('inline-block')
  }
}
