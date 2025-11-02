import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, computed, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import Profile from '#models/profile'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Subscription from '#models/subscription'
import ActivityLog from '#models/activity_log'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

export default class User extends compose(BaseModel, SoftDeletes) {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(table: User) {
    table.id = randomUUID()
  }

  @column()
  declare oauthProvider: string

  @column()
  declare oauthId: string

  @column()
  declare email: string

  @column()
  declare name: string

  @column()
  declare avatarUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>

  @hasMany(() => ActivityLog)
  declare activityLogs: HasMany<typeof ActivityLog>

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @computed()
  public get isUserPremium(): boolean {
    const subs = this.subscriptions ?? []
    return subs.some((sub) => sub.isActive)
  }

  @computed()
  public get currentSubscription(): Subscription | null {
    const subs = this.subscriptions ?? []

    const activeSubs = subs
      .filter((sub) => {
        if (sub.plan === 'lifetime') return true
        if (sub.plan === 'free') return false
        if (sub.status !== 'active') return false
        if (!sub.expiredAt) return false
        return sub.expiredAt > DateTime.now()
      })
      .sort((a, b) => (b.expiredAt?.toMillis() ?? 0) - (a.expiredAt?.toMillis() ?? 0))

    return activeSubs.length > 0 ? activeSubs[0] : null
  }
}
