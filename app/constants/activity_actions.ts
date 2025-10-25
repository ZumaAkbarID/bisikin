export const ActivityActions = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  USER_REGISTERED: 'user_registered',

  PROFILE_UPDATE: 'update_profile',
  PROFILE_VIEW: 'view_profile',

  SEND_MESSAGE: 'send_message',
  READ_MESSAGE: 'read_message',
  DELETE_MESSAGE: 'delete_message',

  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  SUBSCRIPTION_EXPIRED: 'subscription_expired',

  ADMIN_LOGIN: 'admin_login',
  ADMIN_ACTION: 'admin_action',
} as const

export type ActivityAction = (typeof ActivityActions)[keyof typeof ActivityActions]
