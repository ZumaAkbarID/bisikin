/// <reference lib="dom" />

import { createIcons, icons } from 'lucide'

createIcons({ icons })

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault()

    const targetSelector = anchor.getAttribute('href')
    if (!targetSelector) return

    const target = document.querySelector(targetSelector) as HTMLElement | null
    if (!target) return

    const offset = 24
    const top = target.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({
      top,
      behavior: 'smooth',
    })
  })
})

const menuBtn = document.getElementById('menu-btn') as HTMLButtonElement
const mobileMenu = document.getElementById('mobile-menu') as HTMLDivElement
const desktopMenu = document.getElementById('desktop-menu') as HTMLDivElement
const navElement = document.getElementById('nav') as HTMLElement
let menuOpen = false

menuBtn?.addEventListener('click', () => {
  menuOpen = !menuOpen

  if (menuOpen) {
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px'
    mobileMenu.style.opacity = '1'
    menuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>'
    navElement.classList.add('bg-white/70', 'backdrop-blur-md', 'shadow-sm')
  } else {
    mobileMenu.style.maxHeight = '0px'
    mobileMenu.style.opacity = '0'
    menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>'
    navElement.classList.remove('bg-white/70', 'backdrop-blur-md', 'shadow-sm')
  }

  createIcons({ icons })
})

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    desktopMenu.classList.add('max-w-7xl')
    navElement.classList.add(
      'bg-white/70',
      'backdrop-blur-md',
      'shadow-sm',
      'transition-all',
      'duration-500'
    )
  }

  if (window.scrollY <= 10 && !menuOpen) {
    desktopMenu.classList.remove('max-w-7xl')
    navElement.classList.remove('bg-white/70', 'backdrop-blur-md', 'shadow-sm')
  }
})

const page = document.querySelector('meta[name="data-page"]')?.getAttribute('content')

if (page === 'profile') {
  import('./profile.js').then(() => {
    console.log('Profile module loaded 🌿')
  })
}

import('./auth.js').then(() => {
  console.log('Auth module loaded 🔐')
})
