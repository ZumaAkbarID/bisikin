import Message from '#models/message'
import Profile from '#models/profile'
import TurnstileService from '#services/turnstile_service'
import { sendMessageValidator } from '#validators/send_message'
import cache from '@adonisjs/cache/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export default class MessagesController {
  async sendMessage({ params, request, response }: HttpContext) {
    const username = params.username.replace('@', '')
    const { message, clue, sender, isAnonymous } = await request.validateUsing(sendMessageValidator)

    const ip = request.ip()
    const token = request.input('cf-turnstile-response')
    const verified = await TurnstileService.verify(token, ip)
    if (!verified) {
      return response.badRequest({
        message: 'Verifikasi robot gagal. Silakan refresh dan coba lagi.',
      })
    }

    const profile = await Profile.findByOrFail('username', username)

    await Message.create({
      profileId: profile.id,
      senderName: sender,
      clue: clue,
      message,
      isAnonymous,
      isRead: false,
      ipAddress: request.ip(),
      userAgent: request.header('User-Agent') || null,
    })

    const userCache = cache.namespace('user')
    const messagesCache = userCache.namespace(`messages:${username}`)
    await messagesCache.clear()

    return response.ok({ message: 'Pesan berhasil dikirim!' })
  }
}
