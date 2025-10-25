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
import router from '@adonisjs/core/services/router'
import { messageSendThrottle } from '#start/limiter'

const regexUsername = /^@[a-zA-Z0-9_.]+$/

router.get('/', [LandingsController, 'index']).as('landing')

router.get('/google/redirect', [LoginController, 'redirect']).as('auth.google.redirect')
router.get('/auth/google/callback', [LoginController, 'handleCallback']).as('auth.google.callback')

router
  .get('/:username', [ProfilesController, 'show'])
  .where('username', regexUsername)
  .as('profile')

router
  .post('/:username', [MessagesController, 'sendMessage'])
  .where('username', regexUsername)
  .as('profile.sendMessage')
  .use(messageSendThrottle)
