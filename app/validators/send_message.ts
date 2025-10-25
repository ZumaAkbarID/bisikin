import vine from '@vinejs/vine'

export const sendMessageValidator = vine.compile(
  vine.object({
    message: vine.string().minLength(10).maxLength(1000),
    clue: vine.string().maxLength(100).nullable(),
    sender: vine.string().maxLength(50).nullable(),
    isAnonymous: vine.boolean(),
  })
)
