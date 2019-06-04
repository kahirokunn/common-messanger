export const GROUP = {
  name: 'group',
  children: {
    SENT: {
      name: 'sent',
      children: {}
    }
  }
}
export const USER = {
  name: 'user',
  children: {
    SENT_MESSAGE_ADMIN: {
      name: 'sentMessageAdmin',
      children: {}
    },
    SENT_MESSAGE_ONE_TO_ONE: {
      name: 'sentMessageOneToOne',
      children: {}
    },
    MESSAGE_ADMIN: {
      name: 'messageAdmin',
      children: {}
    },
    MESSAGE_ONE_TO_ONE: {
      name: 'messageOneToOne',
      children: {}
    },
    GROUP: {
      name: GROUP.name,
      children: {
        MESSAGE_GROUP: {
          name: 'messageGroup',
          children: {}
        }
      }
    }
  },
} as const
