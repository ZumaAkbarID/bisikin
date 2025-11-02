import { defineConfig } from '@adonisjs/shield'

const shieldConfig = defineConfig({
  /**
   * Configure CSP policies for your app. Refer documentation
   * to learn more
   */
  csp: {
    enabled: true,
    reportOnly: false,
    directives: {
      defaultSrc: ["'self'"],

      // ✅ Script — Allow inline via nonce, and Cloudflare Turnstile scripts
      scriptSrc: [
        "'self'",
        '@nonce',
        "'unsafe-inline'", // (optional, buat dev biar gak ribet)
        'https://challenges.cloudflare.com',
        'https://*.challenges.cloudflare.com',
      ],

      // ✅ Frame/Iframe — Allow Turnstile iframe
      frameSrc: [
        "'self'",
        'https://challenges.cloudflare.com',
        'https://*.challenges.cloudflare.com',
      ],

      // ✅ Styles — Google Fonts, Tailwind inline
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      styleSrcElem: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],

      // ✅ Fonts — Google Fonts CDN
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],

      // ✅ Images — Cloudflare, svgrepo, data-URI
      imgSrc: ["'self'", 'data:', 'https://challenges.cloudflare.com', 'https://www.svgrepo.com'],

      // ✅ Connections (AJAX, WebSocket)
      connectSrc: [
        "'self'",
        'https://challenges.cloudflare.com',
        'https://*.challenges.cloudflare.com',
        'wss://*.ngrok-free.dev', // kalau lo develop via ngrok/vite
      ],
    },
  },

  /**
   * Configure CSRF protection options. Refer documentation
   * to learn more
   */
  csrf: {
    enabled: true,
    exceptRoutes: [],
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  /**
   * Control how your website should be embedded inside
   * iFrames
   */
  xFrame: {
    enabled: true,
    action: 'DENY',
  },

  /**
   * Force browser to always use HTTPS
   */
  hsts: {
    enabled: true,
    maxAge: '180 days',
  },

  /**
   * Disable browsers from sniffing the content type of a
   * response and always rely on the "content-type" header.
   */
  contentTypeSniffing: {
    enabled: true,
  },
})

export default shieldConfig
