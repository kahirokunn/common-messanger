import { Room as PersonalizedRoom } from "../domain/account/room"
import { Room } from "../domain/message/room"
import { Omit } from "../submodule/type"
import { Message } from "../domain/message/message"
import { Id } from "./type";
import { UnreadMessage } from "../domain/account/unreadMessage";

type Collection<T> = { [id: string]: T }
type Path = string

export type FirestoreSchema = {
  rooms: Collection<Omit<Room, 'id'> & {
    messages: Collection<Message>
  }>,
  accounts: Collection<Omit<PersonalizedRoom, 'id'>> & {
    unreadMessages: Collection<UnreadMessage>
  }
}

export function getRoomPath(): Path {
  return 'rooms' as const
}

export function getMessagePath(roomId: Id): Path {
  return `${getRoomPath()}/${roomId}/messages`
}
