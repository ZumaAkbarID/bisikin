/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const LandingsController = () => import('#controllers/landings_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const MessagesController = () => import('#controllers/messages_controller')
const HealthChecksController = () => import('#controllers/health_checks_controller')
const ScanIpAddressesController = () => import('#controllers/premium/scan_ip_addresses_controller')
const LogoutsController = () => import('#controllers/auth/logouts_controller')
import router from '@adonisjs/core/services/router'
import { checkUsernameThrottle, messageSendThrottle } from '#start/limiter'
import { middleware } from '#start/kernel'

const regexUsername = /^@[a-zA-Z0-9_.]+$/

router.get('/', [LandingsController, 'index']).as('landing')
router.get('/google/redirect', [LoginController, 'redirect']).as('auth.google.redirect')
router.get('/auth/google/callback', [LoginController, 'handleCallback']).as('auth.google.callback')
router.get('/health', [HealthChecksController]).as('health.check')
router
  .post('/check-username/:username', [ProfilesController, 'checkUsernameAvailability'])
  .as('profiles.checkUsername')
  .use(checkUsernameThrottle)

router
  .group(() => {
    router.post('/logout', [LogoutsController]).as('auth.logout')
    router.post('/profile/update', [ProfilesController, 'update']).as('profile.update')

    router
      .group(() => {
        router
          .post('/scan-ip-addresses/:ipAddress', [ScanIpAddressesController])
          .as('scanIpAddress')
      })
      .prefix('/premium')
      .as('premium')
  })
  .middleware(
    middleware.auth({
      guards: ['web'],
    })
  )

router
  .get('/:username', [ProfilesController, 'show'])
  .where('username', regexUsername)
  .as('profile')

router
  .post('/:username', [MessagesController, 'sendMessage'])
  .where('username', regexUsername)
  .as('profile.sendMessage')
  .use(messageSendThrottle)
