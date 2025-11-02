import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { randomUUID } from 'node:crypto'

export default class Subscription extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(table: Subscription) {
    table.id = randomUUID()
  }

  @column()
  declare userId: string

  @column()
  declare plan: 'free' | 'lifetime' | 'rich'

  @column()
  declare status: 'active' | 'inactive' | 'canceled'

  @column.dateTime()
  declare startedAt: DateTime | null

  @column.dateTime()
  declare expiredAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @computed()
  public get isActive(): boolean {
    if (this.plan === 'lifetime') return true
    if (this.plan === 'free') return false
    if (this.status !== 'active') return false
    if (!this.expiredAt) return false

    return this.expiredAt > DateTime.now()
  }
}
