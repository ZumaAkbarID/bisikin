import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { randomUUID } from 'node:crypto'

const oauthProviders = ['google', 'github', 'facebook', 'twitter']

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      oauthProvider: faker.helpers.arrayElement(oauthProviders),
      oauthId: randomUUID(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
    }
  })
  .build()
