import { Message } from '../message/message'

export type UnreadMessageSegment = {
  [id: string]: Omit<Message, 'id'>
}
