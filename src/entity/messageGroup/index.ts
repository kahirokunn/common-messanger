import { ToTextMessage, ToNoteMessage, ToImageMessage } from "../message";

type Base = {
  memberIds: Array<string>
  id: string
  groupId: string
  sentFromAccountId: string
  createdAt: Date
}

export type GroupTextMessage = ToTextMessage<Base>

export type GroupNoteMessage = ToNoteMessage<Base>

export type GroupImageMessage = ToImageMessage<Base>

export type GroupMessage = GroupTextMessage | GroupNoteMessage | GroupImageMessage

export { MESSAGE_TYPE as GROUP_MESSAGE_TYPE } from '../message'
