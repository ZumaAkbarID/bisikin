/// <reference lib="dom" />

import axios from 'axios'
import { UAParser } from 'ua-parser-js'

console.log('Profile module initialized 🌿')

const csrfToken = document
  .querySelector('meta[name="csrf-token"]')!
  .getAttribute('content') as string

axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

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

  if (!clueField || !nameField) return

  const selected = Array.from(modeInputs).find((i) => i.checked)?.value

  if (selected === 'anonymous') {
    clueField.classList.remove('hidden')
    nameField.classList.add('hidden')
  } else {
    clueField.classList.add('hidden')
    nameField.classList.remove('hidden')
  }
}

function resetTurnstile() {
  // @ts-ignore
  if (window.turnstile) {
    // @ts-ignore
    window.turnstile.reset()
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
  const turnstileTokenInput = document
    .querySelector('meta[name="turnstile_token"]')!
    .getAttribute('content') as string

  if (!form || !messageInput.value || !username) return

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

  if (!turnstileTokenInput) {
    showToast('Verifikasi robot gagal. Silakan refresh dan coba lagi.', 'error')
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
      'clue': isAnonymous ? clue || null : null,
      'sender': isAnonymous ? null : sender,
      isAnonymous,
      'cf-turnstile-response': turnstileTokenInput,
    })

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
      } else if (status === 400) {
        showToast(err.response.data.message || 'Gagal mengirim pesan, coba lagi.', 'error')
        return
      }
    }

    showToast('Gagal mengirim pesan, coba lagi.', 'error')
  } finally {
    allInputs.forEach((el) => (el.disabled = false))
    submitText.innerText = 'Kirim Pesan'
    submitSpinner.classList.add('hidden')
    submitSpinner.classList.remove('inline-block')
    resetTurnstile()
  }
}

const modal = document.getElementById('message-modal') as HTMLDivElement | null
const closeBtn = document.getElementById('close-modal') as HTMLButtonElement | null
const modalMessage = document.getElementById('modal-message') as HTMLParagraphElement | null
const modalSender = document.getElementById('modal-sender') as HTMLSpanElement | null
const modalClue = document.getElementById('modal-clue') as HTMLSpanElement | null
const modalIpAddress = document.getElementById('modal-ip-address') as HTMLSpanElement | null
const modalSentAt = document.getElementById('modal-sent-at') as HTMLSpanElement | null
const modalUa = document.getElementById('modal-ua') as HTMLSpanElement | null
const modalIpScan = document.getElementById('modal-ip-scan') as HTMLSpanElement | null

if (modal && closeBtn && modalMessage && modalSender && modalClue) {
  document.querySelectorAll<HTMLDivElement>('.message-card').forEach((card) => {
    card.addEventListener('click', () => {
      modalMessage.textContent = `"${card.dataset.message ?? ''}"`
      modalSender.textContent = card.dataset.sender ?? ''
      modalClue.textContent = card.dataset.clue ? `💡 ${card.dataset.clue}` : ''
      if (modalIpAddress && modalSentAt && modalUa && modalIpScan) {
        modalIpAddress.textContent = card.dataset.ipAddress ?? 'N/A'
        modalSentAt.textContent = card.dataset.sentAt
          ? `Dikirim pada: ${new Date(card.dataset.sentAt).toLocaleString()}`
          : 'N/A'
        const uaString = card.dataset.ua ?? ''
        if (uaString) {
          renderUserAgentInfo(uaString)
        } else {
          modalUa.textContent = 'N/A'
        }

        renderIpAddressInfo(card.dataset.ipAddress ?? '')
      }

      modal.classList.remove('hidden')
      document.body.style.overflow = 'hidden'
    })
  })

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden')
    document.body.style.overflow = ''
  })

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden')
      document.body.style.overflow = ''
    }
  })
}

function renderUserAgentInfo(uaString: string | null) {
  if (!modalUa) return
  if (!uaString) {
    modalUa.textContent = 'User Agent tidak tersedia.'
    return
  }

  const parser = new UAParser(uaString)
  const os = parser.getOS()
  const browser = parser.getBrowser()
  const cpu = parser.getCPU()
  const device = parser.getDevice()

  const tableHtml = `
    <table class="w-full text-sm text-left text-gray-600 border-separate border-spacing-y-1">
      <tbody>
        <tr>
          <td class="font-medium text-gray-700">🌐 Browser</td>
          <td>${browser.name ?? 'Unknown'} ${browser.version ?? ''}</td>
        </tr>
        <tr>
          <td class="font-medium text-gray-700">💻 OS</td>
          <td>${os.name ?? 'Unknown'} ${os.version ?? ''}</td>
        </tr>
        <tr>
          <td class="font-medium text-gray-700">📱 Device</td>
          <td>
            ${device.vendor ? `${device.vendor} ` : ''}
            ${device.model ?? 'Unknown'} 
            ${device.type ? `(${device.type})` : ''}
          </td>
        </tr>
        <tr>
          <td class="font-medium text-gray-700">⚙️ CPU</td>
          <td>${cpu.architecture ?? 'Unknown'}</td>
        </tr>
      </tbody>
    </table>
  `

  modalUa.innerHTML = tableHtml
}

async function renderIpAddressInfo(ipAddress: string | null) {
  if (!modalIpAddress) return
  if (!ipAddress) {
    modalIpAddress.textContent = 'IP Address tidak tersedia.'
    return
  }

  const data = await axios
    .post('/premium/scan-ip-addresses/' + ipAddress)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response.status === 403) {
        if (modalIpScan) modalIpScan.textContent = err.response.data.message
      } else if (err.response.status === 400) {
        if (modalIpScan) modalIpScan.textContent = err.response.data.message
      } else {
        if (modalIpScan) modalIpScan.textContent = 'Gagal mengambil data IP.'
      }
      return null
    })

  const tableHtml = `
    <table class="w-full text-sm text-left text-gray-600 border-separate border-spacing-y-1">
      <tbody>
        <tr>
          <td class="font-medium text-gray-700">Negara</td>
          <td>${data.country ?? 'Unknown'}</td>
        </tr>
        <tr>
          <td class="font-medium text-gray-700">Provinsi</td>
          <td>${data.regionName ?? 'Unknown'}</td>
        </tr>
        <tr>
          <td class="font-medium text-gray-700">Kota</td>
          <td>${data.city ?? 'Unknown'}</td>
        </tr>
        <tr>
          <td class="font-medium text-gray-700">Kecamatan</td>
          <td>${data.district ?? 'Unknown'}</td>
        </tr>
        <tr>
          <td class="font-medium text-gray-700">Internet</td>
          <td>${data.isp ?? 'Unknown'}</td>
        </tr>
      </tbody>
    </table>
  `
  if (modalIpScan) modalIpScan.innerHTML = tableHtml
}

const editIcon = document.querySelector('#edit-profile-btn')
if (editIcon) {
  editIcon?.addEventListener('click', initEditProfileModal)
}

function initEditProfileModal() {
  const modal = document.getElementById('edit-profile-modal')
  const closeBtn = document.getElementById('close-edit-modal')
  const cancelBtn = document.getElementById('cancel-edit')
  const avatarInput = document.getElementById('avatar-input') as HTMLInputElement | null
  const previewAvatar = document.getElementById('preview-avatar') as HTMLImageElement | null

  if (!editIcon || !modal) return

  editIcon.addEventListener('click', () => {
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  })

  const closeModal = () => {
    modal.classList.add('hidden')
    document.body.style.overflow = ''
  }

  closeBtn?.addEventListener('click', closeModal)
  cancelBtn?.addEventListener('click', closeModal)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  avatarInput?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file && previewAvatar) {
      previewAvatar.src = URL.createObjectURL(file)
    }
  })
}

let usernameTimer: number | undefined

const usernameInput = document.getElementById('username-input') as HTMLInputElement | null
const bioInput = document.getElementById('bio-input') as HTMLTextAreaElement | null
const feedback = document.getElementById('username-feedback') as HTMLParagraphElement | null

if (usernameInput && feedback) {
  usernameInput.addEventListener('input', () => {
    usernameInput.classList.remove('border-red-400', 'border-green-400')
    feedback.textContent = ''

    usernameInput.value = usernameInput.value.replace(/\s+/g, '')

    if (usernameInput && usernameInput.value.length > 30) {
      usernameInput.value = usernameInput.value.slice(0, 30)
    }

    if (bioInput && bioInput.value.length > 160) {
      bioInput.value = bioInput.value.slice(0, 160)
    }

    clearTimeout(usernameTimer)
    usernameTimer = window.setTimeout(async () => {
      const username = usernameInput.value.trim()
      if (!username) return

      const data = await axios
        .post(`/check-username/${username}`)
        .then((res) => res.data)
        .catch((e) => {
          if (e.status === 400) {
            usernameInput.classList.add('border-red-400')
            feedback.textContent = '❌ ' + e.response.data.message
            feedback.classList.remove('text-green-600')
            feedback.classList.add('text-red-500')
          } else {
            feedback.textContent = '⚠️ Gagal mengecek username'
            feedback.classList.add('text-yellow-600')
          }
        })

      if (data.available) {
        usernameInput.classList.add('border-green-400')
        feedback.textContent = '✅ ' + data.message
        feedback.classList.remove('text-red-500')
        feedback.classList.add('text-green-600')
      } else {
        usernameInput.classList.add('border-red-400')
        feedback.textContent = '❌ ' + data.message
        feedback.classList.remove('text-green-600')
        feedback.classList.add('text-red-500')
      }
    }, 500)
  })
}

const flashErrorMeta = document.querySelector('meta[name="flash-errors"]') as HTMLMetaElement | null
const flashSuccessMeta = document.querySelector(
  'meta[name="flash-success"]'
) as HTMLMetaElement | null

if (flashErrorMeta?.content) {
  showToast(flashErrorMeta.content, 'error')
}

if (flashSuccessMeta?.content) {
  showToast(flashSuccessMeta.content, 'success')
}

function initShareProfile() {
  const shareBtn = document.getElementById('share-profile-btn') as HTMLButtonElement | null
  if (!shareBtn) return

  shareBtn.addEventListener('click', async () => {
    const username = document
      .getElementById('profile-username')
      ?.textContent?.replace('@', '')
      .trim()
    const shareUrl = `${window.location.origin}/@${username}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kirim bisikan ke @${username}`,
          text: `Ayo kirim pesan anonim ke @${username}! 🌿`,
          url: shareUrl,
        })
      } catch (err) {
        console.warn('Share dibatalkan:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        showToast('Tautan profil disalin ke clipboard! 📋')
      } catch {
        alert('Gagal menyalin tautan 😢')
      }
    }
  })
}

initShareProfile()
