import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async redirect({ ally }: HttpContext) {
    const driverInstance = ally.use('google').stateless()
    return driverInstance.redirect()
  }

  async handleCallback({ ally }: HttpContext) {
    const googleUser = ally.use('google').stateless()

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (googleUser.accessDenied()) {
      return 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (googleUser.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    /**
     * GitHub responded with some error
     */
    if (googleUser.hasError()) {
      return googleUser.getError()
    }

    /**
     * Access user info
     */
    const user = await googleUser.user()
    return user
  }
}
