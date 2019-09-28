import { Room } from '../message/room'
import { Message } from '../message/message'
import { UnreadMessageSegment } from '../account/unreadMessageSegment'

export type RoomActivity = Room & {
  lastMessage: Message | null
  unreadMessages: UnreadMessageSegment[string][]
}
