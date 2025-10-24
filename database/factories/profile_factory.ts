import factory from '@adonisjs/lucid/factories'
import Profile from '#models/profile'

export const ProfileFactory = factory
  .define(Profile, async ({ faker }) => {
    return {
      username: faker.internet.username(),
      bio: faker.lorem.sentence(),
      isPublic: faker.datatype.boolean(),
      themeColor: faker.color.rgb({ format: 'hex' }),
      avatar: faker.image.avatar(),
    }
  })
  .build()
