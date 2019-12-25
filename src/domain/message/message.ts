import { Id } from '../../firebase/type'

export enum MESSAGE_TYPE {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  NOTE = 'NOTE',
  MEDIA = 'MEDIA',
}

type Shared = {
  id: Id
  sentFromAccountId: Id
  createdAt: Date
}

export type TextMessage = Shared & {
  type: MESSAGE_TYPE.TEXT
  text: string
}

export type NoteMessage = Shared & {
  type: MESSAGE_TYPE.NOTE
  text: string
  noteId: string
}

export type ImageMessage = Shared & {
  type: MESSAGE_TYPE.IMAGE
  imageUrl: string
}

export type MediaMessage = Shared & {
  type: MESSAGE_TYPE.MEDIA
  mediaType: 'PDF' | 'MOVIE'
  fileUrl: string
}

export type Message = TextMessage | NoteMessage | ImageMessage | MediaMessage
