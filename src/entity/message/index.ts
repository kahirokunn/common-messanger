export enum MessageType {
  text = 'text',
  image = 'image',
  note = 'note',
}

type Base = {
  id: string
  sentFromAccountId: string
  sentToAccountId: string
  createdAt: Date
}

export type ToTextMessage<T> = T & {
  type: MessageType.text
  text: string
}
export type TextMessage = ToTextMessage<Base>

export type ToNoteMessage<T> = T & {
  type: MessageType.note
  text: string
  noteId: string
}
export type NoteMessage = ToNoteMessage<Base>

export type ToImageMessage<T> = T & {
  type: MessageType.image
  imageUrl: string
}
export type ImageMessage = ToImageMessage<Base>

export type Message = TextMessage | NoteMessage | ImageMessage
