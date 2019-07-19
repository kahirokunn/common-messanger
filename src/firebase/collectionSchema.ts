import { Room } from "../domain/message/room"
import { Omit } from "../submodule/type"
import { Message } from "../domain/message/entity"
import { Id } from "../domain/message/type";

type Collection<T> = { [id: string]: T }
type Path = string

export type FirestoreSchema = {
  rooms: Collection<Omit<Room, 'id'> & {
    messages: Collection<Message>
  }>,
}

export function getRoomPath(): Path {
  return 'rooms' as const
}

export function getMessagePath(roomId: Id): Path {
  return `${getRoomPath()}/${roomId}/messages`
}
