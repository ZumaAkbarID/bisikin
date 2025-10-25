import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Profile from '#models/profile'
import { randomUUID } from 'node:crypto'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'

export default class Message extends compose(BaseModel, SoftDeletes) {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(table: Message) {
    table.id = randomUUID()
  }

  @column()
  declare profileId: string

  @column()
  declare senderName: string | null

  @column()
  declare clue: string | null

  @column()
  declare message: string

  @column()
  declare isAnonymous: boolean

  @column()
  declare isRead: boolean

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>
}
