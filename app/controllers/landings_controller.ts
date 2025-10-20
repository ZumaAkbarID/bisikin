import type { HttpContext } from '@adonisjs/core/http'

export default class LandingsController {
  async index({ view }: HttpContext) {
    return view.render('pages/landing')
  }
}
