import Profile from '#models/profile'
import ProfileService from '#services/profile'
import { UpdateProfileValidator } from '#validators/update_profile'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import cache from '@adonisjs/cache/services/main'

export default class ProfilesController {
  async show({ request, params, view, auth }: HttpContext) {
    const username = params.username.replace('@', '')
    const page = request.input('page', 1)
    const perPage = 9

    const userCache = cache.namespace('user')

    const profile = await userCache.getOrSet({
      key: `profile:${username}`,
      ttl: '24h',
      grace: '1h',
      factory: async () => {
        const data = await Profile.query().where('username', username).preload('user').first()
        return data ? data.toJSON() : null
      },
    })

    if (!profile) {
      return view.render('pages/errors/not_found', { username })
    }

    const messagesCache = userCache.namespace(`messages:${username}`)
    const messages = await messagesCache.getOrSet({
      key: `page:${page}`,
      ttl: '15m',
      grace: '5m',
      factory: async () => {
        const profileModel = await Profile.findByOrFail('username', username)
        const paginator = await profileModel
          .related('messages')
          .query()
          .orderBy('createdAt', 'desc')
          .paginate(page, perPage)

        return {
          data: paginator.all(),
          meta: paginator.getMeta(),
        }
      },
    })

    let isOwner = false
    let isPremium = false

    if (await auth.use('web').check()) {
      const user = await auth.use('web').authenticate()
      await user.load('profile')

      isOwner = user.id === profile.userId

      const premiumCache = cache.namespace('user:premium')

      const premiumStatus = await premiumCache.getOrSet({
        key: `user:${user.id}`,
        ttl: '10m',
        factory: async () => {
          await user.load('subscriptions')
          return user.isUserPremium
        },
      })

      isPremium = premiumStatus
    }

    return view.render('pages/profile', {
      profile,
      messages: messages.data,
      pagination: messages.meta,
      isOwner,
      isPremium,
    })
  }

  async checkUsernameAvailability({ params, response }: HttpContext) {
    const username = params.username.replace('@', '')
    const allowedPattern = /^[a-zA-Z0-9_.]+$/

    if (!allowedPattern.test(username)) {
      return response.badRequest({ available: false, message: 'Username tidak valid' })
    }

    if (!username) {
      return response.badRequest({ available: false, message: 'Username dibutuhkan' })
    }

    if (username.length < 3 || username.length > 30) {
      return response.badRequest({
        available: false,
        message: 'Panjang username harus antara 3-30 karakter',
      })
    }

    return response.ok(await ProfileService.checkUsernameAvailability(username))
  }

  async update({ session, auth, request, response }: HttpContext) {
    const user = await auth.use('web').authenticate()
    await user.load('profile')

    const profile = user.profile!

    const { bio, avatar, username } = await request.validateUsing(UpdateProfileValidator)

    if (username && username !== profile.username) {
      const availability = await ProfileService.checkUsernameAvailability(username)

      if (!availability.available) {
        session.flash('errors', { message: 'Username sudah digunakan' })
        return response.redirect().back()
      }

      profile.username = username
    }

    if (bio) profile.bio = bio
    if (avatar) {
      const fileName = `avatar_${user.id}_${cuid()}.${avatar.extname}`
      await avatar.moveToDisk(`avatars/${fileName}`)
      profile.avatar = avatar.meta.url
    }

    await profile.save()

    const userCache = cache.namespace('user')

    if (profile.$dirty.username) {
      await userCache.delete({ key: `profile:${profile.$original.username}` })
      const messagesCache = userCache.namespace(`messages:${profile.$original.username}`)
      await messagesCache.clear()
    }

    await userCache.set({
      key: `profile:${profile.username}`,
      value: profile.toJSON(),
      ttl: '24h',
    })

    session.flash('success', { message: 'Profil berhasil diperbarui' })

    return response.redirect().toRoute('profile', { username: `@${profile.username}` })
  }
}
