import { Message, TextMessage, NoteMessage, ImageMessage, MediaMessage, MESSAGE_TYPE } from './message'

export function isTextMessage(message: Message): message is TextMessage {
  return message.type === MESSAGE_TYPE.TEXT
}

export function isNoteMessage(message: Message): message is NoteMessage {
  return message.type === MESSAGE_TYPE.NOTE
}

export function isImageMessage(message: Message): message is ImageMessage {
  return message.type === MESSAGE_TYPE.IMAGE
}

export function isMediaMessage(message: Message): message is MediaMessage {
  return message.type === MESSAGE_TYPE.MEDIA
}
