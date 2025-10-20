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
import router from '@adonisjs/core/services/router'

router.get('/', [LandingsController, 'index']).as('landing')

router.get('/google/redirect', [LoginController, 'redirect']).as('auth.google.redirect')
router.get('/auth/google/callback', [LoginController, 'handleCallback']).as('auth.google.callback')

router
  .get('/:username', async ({ params, view }) => {
    return view.render('pages/profile', { username: params.username })
  })
  .where('username', /^@[a-zA-Z0-9_.]+$/)
  .as('profile')
