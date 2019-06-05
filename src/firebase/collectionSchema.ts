import { GroupMessage } from "../entity/messageGroup";
import { Group } from "../entity/group";
import { Omit } from "../submodule/type";
import { Message } from "../entity/message";

type Collection<T> = { [id: string]: T }

export type FirestoreSchema = {
  account: Collection<{
    group: Collection<{
      // group/{groupId}/sentに書き込まれたらここにコピーされる
      messageGroup: Collection<GroupMessage>
    }>,
    sentMessageOneToOne: Collection<Message>
    // sentMessageOneToOneに書き込まれたら、cloud functionでmessageOneToOneにコピーする
    messageOneToOne: Collection<Message>

    sentMessageAdmin: Collection<Message>
  }>,
  group: Collection<Omit<Group, 'id'> & {
    sent: Collection<GroupMessage>
  }>
}

export const GROUP = {
  name: 'group',
  children: {
    SENT: {
      name: 'sent',
      children: {}
    }
  }
}

export const ACCOUNT = {
  name: 'account',
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
  return `${ACCOUNT.name}/${input.accountId}/${ACCOUNT.children.GROUP.name}/${input.groupId}/${ACCOUNT.children.GROUP.children.MESSAGE_GROUP.name}`
}
