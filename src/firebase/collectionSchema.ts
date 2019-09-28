import { Room as PersonalizedRoom } from '../domain/account/room'
import { Room } from '../domain/message/room'
import { Message } from '../domain/message/message'
import { Id } from './type'
import { UnreadMessageSegment } from '../domain/account/unreadMessageSegment'

type Collection<T> = { [id: string]: T }
type Path = string

export type FirestoreSchema = {
  rooms: Collection<
    Omit<Room, 'id'> & {
      messages: Collection<Omit<Message, 'id'>>
    }
  >
  accounts: Collection<Omit<PersonalizedRoom, 'id'>> & {
    unreadMessageSegments: Collection<UnreadMessageSegment>
  }
}

const accountCollectionName = 'accounts' as const
const roomCollectionName = 'rooms' as const
const messageCollectionName = 'messages' as const
const unreadMessageSegmentCollectionName = 'unreadMessageSegments' as const

export function getAccountPath(): Path {
  return accountCollectionName
}

export function getRoomPath(): Path {
  return roomCollectionName
}

export function getMessagePath(roomId: Id): Path {
  return `${getRoomPath()}/${roomId}/${messageCollectionName}`
}

export function getAccountRoomPath(accountId: Id): Path {
  return `${getAccountPath()}/${accountId}/${roomCollectionName}`
}

export function getUnreadMessageSegmentPath(accountId: Id, roomId: Id): Path {
  return `${getAccountPath()}/${accountId}/${roomCollectionName}/${roomId}/${unreadMessageSegmentCollectionName}`
}
