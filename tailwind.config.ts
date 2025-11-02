import type { Config } from 'tailwindcss'
import lineClamp from '@tailwindcss/line-clamp'

export default {
  content: ['./resources/views/**/*.edge', './resources/js/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [lineClamp],
} satisfies Config
