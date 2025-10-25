import { ActivityAction } from '#constants/activity_actions'
import ActivityLog from '#models/activity_log'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'

export default class ActivityLogger {
  static async log(ctx: HttpContext, action: ActivityAction, description?: string) {
    try {
      const user = ctx.auth.user
      const ip = ctx.request.ip()
      const agent = ctx.request.header('user-agent')

      await ActivityLog.create({
        userId: user?.id,
        action,
        description,
        ipAddress: ip,
        userAgent: agent,
      })
    } catch (error) {
      logger.use('activity_log').error(`Failed to log activity: ${error.message}`)
    }
  }
}
