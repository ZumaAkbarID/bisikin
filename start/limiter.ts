/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(10).every('1 minute')
})

export const messageSendThrottle = limiter.define('messageSend', (ctx) => {
  return limiter
    .allowRequests(5)
    .every('30 minutes')
    .usingKey(`send_msg_${ctx.request.ip()}_${ctx.params.username}`)
    .limitExceeded((error) => {
      error.setStatus(429).setMessage('Terlalu banyak mengirim pesan. Silakan coba lagi nanti.')
    })
})

export const checkUsernameThrottle = limiter.define('checkUsername', (ctx) => {
  return limiter
    .allowRequests(20)
    .every('15 minutes')
    .usingKey(`check_username_${ctx.request.ip()}`)
    .limitExceeded((error) => {
      error.setStatus(429).setMessage('Terlalu banyak permintaan. Silakan coba lagi nanti.')
    })
})
