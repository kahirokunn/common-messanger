import { Room } from "../message/room";
import { Message } from "../message/message";
import { UnreadMessageSegment } from "../account/unreadMessageSegment";

export type RoomActivity = Room & {
  lastMessage: Omit<Message, 'id'> | null,
  unreadMessages: UnreadMessageSegment[string][]
}
