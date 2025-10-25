import Profile from '#models/profile'

export default class ProfileService {
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    return !(await Profile.query().where('username', username).first())
  }
}
