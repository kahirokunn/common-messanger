import { GroupMessage, GroupTextMessage, GroupNoteMessage, GroupImageMessage, GroupMessageType } from '../../entity/messageGroup'

export function isTextMessage(message: GroupMessage): message is GroupTextMessage {
  return message.type == GroupMessageType.text
}

export function isNoteMessage(message: GroupMessage): message is GroupNoteMessage {
  return message.type == GroupMessageType.note
}

export function isImageMessage(message: GroupMessage): message is GroupImageMessage {
  return message.type == GroupMessageType.image
}
