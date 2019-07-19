import { Message, TextMessage, NoteMessage, ImageMessage, MESSAGE_TYPE } from './entity'

export function isTextMessage(message: Message): message is TextMessage {
  return message.type == MESSAGE_TYPE.TEXT
}

export function isNoteMessage(message: Message): message is NoteMessage {
  return message.type == MESSAGE_TYPE.NOTE
}

export function isImageMessage(message: Message): message is ImageMessage {
  return message.type == MESSAGE_TYPE.IMAGE
}
