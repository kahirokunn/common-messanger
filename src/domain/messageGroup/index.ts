import { GroupMessage, GroupTextMessage, GroupNoteMessage, GroupImageMessage, GROUP_MESSAGE_TYPE } from '../../entity/messageGroup'

export function isTextMessage(message: GroupMessage): message is GroupTextMessage {
  return message.type == GROUP_MESSAGE_TYPE.TEXT
}

export function isNoteMessage(message: GroupMessage): message is GroupNoteMessage {
  return message.type == GROUP_MESSAGE_TYPE.NOTE
}

export function isImageMessage(message: GroupMessage): message is GroupImageMessage {
  return message.type == GROUP_MESSAGE_TYPE.IMAGE
}
