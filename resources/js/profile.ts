/// <reference lib="dom" />

import axios from 'axios'

console.log('Profile module initialized 🌿')

document
  .querySelectorAll('input[name="mode"]')
  .forEach((i) => i.addEventListener('change', handleModeChange))
document.getElementById('message-form')?.addEventListener('submit', handleSubmit)

handleModeChange()

function showToast(message: string, type = 'success') {
  const toast = document.getElementById('toast')
  const toastMessage = document.getElementById('toast-message')

  if (!toast || !toastMessage) return
  toastMessage.textContent = message
  toast.classList.add('show')

  if (type === 'error') toast.style.background = 'rgba(239, 68, 68, 0.9)'
  else toast.style.background = 'rgba(163, 201, 199, 0.9)'

  setTimeout(() => {
    toast.classList.remove('show')
    toast.style.background = ''
  }, 3000)
}

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

async function handleSubmit(e: Event) {
  e.preventDefault()

  const form = document.getElementById('message-form') as HTMLFormElement
  const messageInput = document.getElementById('message-input') as HTMLTextAreaElement
  const clueInput = document.getElementById('clue-input') as HTMLInputElement
  const nameInput = document.getElementById('name-input') as HTMLInputElement
  const submitText = document.getElementById('submit-text')!
  const submitSpinner = document.getElementById('submit-spinner')!
  const username = document.querySelector('meta[name="data-username"]')!.getAttribute('content')

  const modeInputs = document.querySelectorAll<HTMLInputElement>('input[name="mode"]')
  const selected = Array.from(modeInputs).find((i) => i.checked)?.value
  const isAnonymous = selected === 'anonymous'

  const message = messageInput.value.trim()
  const clue = clueInput.value.trim()
  const sender = nameInput.value.trim()

  if (!message) {
    showToast('Pesan tidak boleh kosong!', 'error')
    return
  }
  if (!isAnonymous && !sender) {
    showToast('Nama harus diisi untuk mode blak-blakan!', 'error')
    return
  }
  if (message.length < 10) {
    showToast('Pesan harus terdiri dari minimal 10 karakter!', 'error')
    return
  } else if (message.length > 1000) {
    showToast('Pesan tidak boleh lebih dari 1000 karakter!', 'error')
    return
  }

  const allInputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input, textarea, button'
  )
  allInputs.forEach((el) => (el.disabled = true))

  submitSpinner.classList.remove('hidden')
  submitSpinner.classList.add('inline-block')
  submitText.innerText = 'Mengirim...'

  try {
    const res = await axios.post(`/@${username}`, {
      message,
      clue: isAnonymous ? clue || null : null,
      sender: isAnonymous ? null : sender,
      isAnonymous,
    })

    console.log(res)

    if (res.status === 200) {
      messageInput.value = ''
      clueInput.value = ''
      nameInput.value = ''
      handleModeChange()

      showToast('Pesan berhasil dikirim! 🌿')
    } else {
      showToast('Gagal mengirim pesan, coba lagi.', 'error')
    }
  } catch (err) {
    console.error(err)
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status
      if (status === 422) {
        showToast('Validasi gagal. Periksa kembali input Anda.', 'error')
        return
      } else if (status === 429) {
        showToast(
          `Terlalu banyak permintaan. Coba lagi dalam ${Math.round(err.response.data.errors[0].retryAfter / 60)} menit.`,
          'error'
        )
        return
      }
    }

    showToast('Gagal mengirim pesan, coba lagi.', 'error')
  } finally {
    allInputs.forEach((el) => (el.disabled = false))
    submitText.innerText = 'Kirim Pesan'
    submitSpinner.classList.add('hidden')
    submitSpinner.classList.remove('inline-block')
  }
}
