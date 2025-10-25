import { ActivityActions } from '#constants/activity_actions'
import Profile from '#models/profile'
import User from '#models/user'
import ActivityLogger from '#services/activity_logger'
import ProfileService from '#services/profile'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

const provider = 'google'

export default class LoginController {
  async redirect({ ally }: HttpContext) {
    const driverInstance = ally.use(provider).stateless()
    return driverInstance.redirect()
  }

  async handleCallback(ctx: HttpContext) {
    const { ally, auth, response } = ctx

    const googleUser = ally.use(provider).stateless()

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (googleUser.accessDenied()) {
      return response.badRequest('You have cancelled the login process')
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (googleUser.stateMisMatch()) {
      return response.badRequest('We are unable to verify the request. Please try again')
    }

    /**
     * GitHub responded with some error
     */
    if (googleUser.hasError()) {
      return response.badRequest(googleUser.getError())
    }

    /**
     * Access user info
     */
    const user = await googleUser.user()

    try {
      const existingUser = await User.firstOrCreate(
        { oauthProvider: provider, oauthId: user.id },
        {
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        }
      )

      if (!existingUser.$hasRelated('profile')) {
        let username = `${user.name.replace(/\s+/g, '').toLowerCase()}`

        await ProfileService.checkUsernameAvailability(username).then(async (isAvailable) => {
          let suffix = 1
          while (!isAvailable) {
            username = `${username}${suffix}`
            isAvailable = await ProfileService.checkUsernameAvailability(username)
            suffix++
          }
        })

        await Profile.create({
          userId: existingUser.id,
          username: username,
          isPublic: true,
          avatar: user.avatarUrl,
        })

        await ActivityLogger.log(
          ctx,
          ActivityActions.USER_REGISTERED,
          'New user registered via Google OAuth'
        )
      } else {
        await ActivityLogger.log(ctx, ActivityActions.LOGIN, 'User logged in via Google OAuth')
      }

      await auth.use('web').login(existingUser, true)

      return response.redirect().toRoute('landing')
    } catch (error) {
      logger.use('login_log').error('Error during login process', error)
      return response.internalServerError(error)
    }
  }
}
