import { cloudflareTurnstile } from '#config/app'
import axios from 'axios'

export default class TurnstileService {
  static async verify(token: string, ip?: string): Promise<boolean> {
    if (!token) return false

    try {
      const res = await axios.post(
        cloudflareTurnstile.verifyUrl,
        new URLSearchParams({
          secret: cloudflareTurnstile.secretKey,
          response: token,
          remoteip: ip || '',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )

      return res.data.success === true
    } catch (err) {
      console.error('Turnstile verification failed:', err)
      return false
    }
  }
}
