import { Room } from "../message/room";
import { Message } from "../message/message";

export type RoomActivity = Room & {
  lastMessage: Message,
  unreadMessages: Message[]
}
