import { Message, TextMessage, NoteMessage, ImageMessage, MessageType } from '../../entity/message'

export function isTextMessage(message: Message): message is TextMessage {
  return message.type == MessageType.text
}

export function isNoteMessage(message: Message): message is NoteMessage {
  return message.type == MessageType.note
}

export function isImageMessage(message: Message): message is ImageMessage {
  return message.type == MessageType.image
}
