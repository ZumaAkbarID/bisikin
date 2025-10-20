const loginButtons = document.querySelectorAll<HTMLButtonElement>('#btn-login, .btn-login')
const loginModal = document.getElementById('login-modal')
const loginCard = document.getElementById('login-card')
const closeLoginModal = document.getElementById('close-login-modal')

function openLoginModal() {
  if (!loginModal || !loginCard) return

  loginModal.classList.remove('hidden')
  requestAnimationFrame(() => {
    loginModal.classList.add('flex')
    loginCard.classList.remove('opacity-0', 'scale-95')
    loginCard.classList.add('opacity-100', 'scale-100')
  })
}

function closeLogin() {
  if (!loginModal || !loginCard) return

  loginCard.classList.remove('opacity-100', 'scale-100')
  loginCard.classList.add('opacity-0', 'scale-95')
  loginModal.classList.remove('opacity-100')
  setTimeout(() => loginModal.classList.add('hidden'), 400)
}

loginButtons.forEach((btn) => btn.addEventListener('click', openLoginModal))

closeLoginModal?.addEventListener('click', closeLogin)

loginModal?.addEventListener('click', (e) => {
  if (e.target === loginModal) closeLogin()
})
