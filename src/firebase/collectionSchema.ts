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

export function sentMessageCollectionPath(input: { groupId: string }) {
  return `${GROUP.name}/${input.groupId}/${GROUP.children.SENT.name}`
}

export function buildGroupMessageCollectionPath(input: { accountId: string, groupId: string }) {
  return `${USER.name}/${input.accountId}/${USER.children.GROUP.name}/${input.groupId}/${USER.children.GROUP.children.MESSAGE_GROUP.name}`
}
