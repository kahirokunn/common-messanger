export enum MESSAGE_TYPE {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  NOTE = 'NOTE',
}

type Base = {
  id: string
  sentFromAccountId: string
  sentToAccountId: string
  createdAt: Date
}

export type ToTextMessage<T> = T & {
  type: MESSAGE_TYPE.TEXT
  text: string
}
export type TextMessage = ToTextMessage<Base>

export type ToNoteMessage<T> = T & {
  type: MESSAGE_TYPE.NOTE
  text: string
  noteId: string
}
export type NoteMessage = ToNoteMessage<Base>

export type ToImageMessage<T> = T & {
  type: MESSAGE_TYPE.IMAGE
  imageUrl: string
}
export type ImageMessage = ToImageMessage<Base>

export type Message = TextMessage | NoteMessage | ImageMessage
