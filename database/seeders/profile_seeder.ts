import { ProfileFactory } from '#database/factories/profile_factory'
import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = await UserFactory.createMany(10)

    for (const user of users) {
      await ProfileFactory.merge({ userId: user.id }).create()
    }
  }
}
