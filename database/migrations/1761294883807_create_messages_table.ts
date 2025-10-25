import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('profile_id').references('id').inTable('profiles').onDelete('CASCADE').index()
      table.string('sender_name').nullable()
      table.string('clue').nullable()
      table.text('message')
      table.boolean('is_anonymous').defaultTo(true)
      table.boolean('is_read').defaultTo(false)

      // tracking
      table.string('ip_address').nullable()
      table.string('user_agent').nullable()

      table.timestamp('created_at').index()
      table.timestamp('updated_at')
      table.timestamp('deleted_at').nullable().index()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
