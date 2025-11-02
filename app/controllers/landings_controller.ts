import type { HttpContext } from '@adonisjs/core/http'

export default class LandingsController {
  async index({ auth, view }: HttpContext) {
    if (await auth.use('web').check()) {
      await (await auth.use('web').authenticate()).load('profile')
    }

    return view.render('pages/landing')
  }
}
