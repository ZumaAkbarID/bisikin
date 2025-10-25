import Profile from '#models/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async show({ params, view }: HttpContext) {
    const username = params.username.replace('@', '')

    const profileExists = await Profile.query().where('username', username).preload('user').first()

    if (!profileExists) {
      return view.render('pages/errors/not_found', { username })
    }

    const messages = await profileExists.related('messages').query().orderBy('createdAt', 'desc')

    return view.render('pages/profile', { profile: profileExists, messages })
  }
}
