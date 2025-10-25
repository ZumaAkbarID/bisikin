import Message from '#models/message'
import Profile from '#models/profile'
import { sendMessageValidator } from '#validators/send_message'
import type { HttpContext } from '@adonisjs/core/http'

export default class MessagesController {
  async sendMessage({ params, request, response }: HttpContext) {
    const username = params.username.replace('@', '')
    const { message, clue, sender, isAnonymous } = await request.validateUsing(sendMessageValidator)

    const profile = await Profile.findByOrFail('username', username)

    await Message.create({
      profileId: profile.id,
      senderName: isAnonymous ? sender || null : null,
      clue: isAnonymous ? null : clue,
      message,
      isAnonymous,
      isRead: false,
      ipAddress: request.ip(),
      userAgent: request.header('User-Agent') || null,
    })

    return response.ok({ message: 'Pesan berhasil dikirim!' })
  }
}
