export const USER = {
  name: 'user',
  children: {
    SENT_MESSAGE_ADMIN: {
      name: 'sentMessageAdmin',
      children: []
    },
    SENT_MESSAGE_ONE_TO_ONE: {
      name: 'sentMessageOneToOne',
      children: []
    },
    SENT_MESSAGE_GROUP: {
      name: 'sentMessageOneToOne',
      children: []
    },
    MESSAGE_ADMIN: {
      name: 'messageAdmin',
      children: []
    },
    MESSAGE_ONE_TO_ONE: {
      name: 'messageOneToOne',
      children: []
    },
    MESSAGE_GROUP: {
      name: 'messageOneToOne',
      children: []
    }
  }
} as const
