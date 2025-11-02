import vine from '@vinejs/vine'

export const UpdateProfileValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(30)
      .regex(/^[a-zA-Z0-9_.]+$/),
    bio: vine.string().maxLength(160).optional(),
    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      })
      .optional(),
  })
)
