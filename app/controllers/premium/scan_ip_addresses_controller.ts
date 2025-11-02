import { scanIpAddress } from '#services/scanIpAddress'
import type { HttpContext } from '@adonisjs/core/http'

export default class ScanIpAddressesController {
  checkIfLocalIp(ip: string): boolean {
    const localIpPatterns = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ]

    return localIpPatterns.some((pattern) => pattern.test(ip))
  }

  async handle({ auth, params, response }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    const ipAddress = params.ipAddress as string | null
    if (!ipAddress) {
      return response.badRequest({ message: 'IP address is required' })
    }

    if (this.checkIfLocalIp(ipAddress)) {
      return response.badRequest({ message: 'Local IP addresses cannot be scanned' })
    }

    if (!auth.use('web').user?.isUserPremium) {
      return response.forbidden({ message: 'Access denied. Premium membership required.' })
    }

    const scanResult = await scanIpAddress(ipAddress)

    return response.ok(scanResult)
  }
}
