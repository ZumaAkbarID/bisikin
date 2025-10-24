import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.enum('plan', ['free', 'lifetime', 'rich']).defaultTo('free')
      table.enum('status', ['active', 'inactive', 'canceled']).defaultTo('active')
      table.timestamp('started_at').nullable()
      table.timestamp('expired_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
