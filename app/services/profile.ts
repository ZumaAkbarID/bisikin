import { reservedWords } from '#config/reservedword'
import Profile from '#models/profile'

export default class ProfileService {
  static async checkUsernameAvailability(
    username: string
  ): Promise<{ available: boolean; message: string }> {
    const allowedPattern = /^[a-zA-Z0-9_.]+$/
    const lower = username.toLowerCase()

    if (!allowedPattern.test(username)) return { available: false, message: 'Username tidak valid' }

    if (reservedWords.some((word) => word.toLowerCase() === lower))
      return { available: false, message: 'Username tidak tersedia' }

    const existing = await Profile.query().where('username', lower).first()
    if (existing) return { available: false, message: 'Username telah digunakan' }

    return { available: true, message: 'Username tersedia' }
  }
}
