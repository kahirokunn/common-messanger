import { Observable, Subject, Subscription } from 'rxjs'
import { Room } from '../../domain/message/room'
import { RoomActivity } from '../../domain/timeline/room'
import { RoomObserver, RoomsData } from './room'
import { UnreadMessageObserver, UnreadMessagesData } from './unreadMessageSegments'
import { UnreadMessageSegment } from '../../domain/account/unreadMessageSegment'
import { Message } from '../../domain/message/message';
import { MessageObserver, MessagesData } from '../message';
import { merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export type RoomDoc = Omit<Omit<Room, 'updatedAt'>, 'createdAt'> & {
  createdAt: import('firebase').firestore.Timestamp
  updatedAt: import('firebase').firestore.Timestamp
}

export function roomMapper(roomDoc: RoomDoc): Room {
  return {
    ...roomDoc,
    createdAt: roomDoc.createdAt.toDate(),
    updatedAt: roomDoc.updatedAt.toDate(),
  }
}


type Item = RoomActivity[]
type KV<T> = { [roomId: string]: T }
type UnreadMessages = KV<UnreadMessageSegment[string][]>
type LastMessages = KV<Message>

function roomActivityMapper(rooms: Room[], unreadMessages: UnreadMessages, lastMessages: LastMessages): RoomActivity[] {
  return rooms.map(room => ({
    ...room,
    unreadMessages: unreadMessages[room.id] || [],
    lastMessage: lastMessages[room.id] || null,
  }))
}

export class TimelineObserver {
  private readonly _rooms: Subject<Item> = new Subject<Item>()
  private readonly _subscription: Subscription

  constructor(
    private readonly roomObserver: RoomObserver,
    private readonly unreadMessageObserver: UnreadMessageObserver,
    private readonly messageObserver: MessageObserver
  ) {
    let allRooms: Room[] = []
    let unreadMessages: UnreadMessages = {}
    let lastMessages: LastMessages = {}

    this._subscription = merge(
      this.roomObserver.rooms$.pipe(tap(rooms => {
        allRooms = rooms
        rooms.forEach(room => {
          this.messageObserver.fetchMessage(room.id, 1)
          this.unreadMessageObserver.fetchUnreadMessages(room.id)
        })
      })),
      this.unreadMessageObserver.unreadMessages$.pipe(tap(data => unreadMessages[data.roomId] = Object.values(data.unreadMessages))),
      this.messageObserver.messages$.pipe(tap(data => lastMessages[data.roomId] = data.messages[0])),
    ).subscribe(() => this._rooms.next(roomActivityMapper(allRooms, unreadMessages, lastMessages)))
  }

  get rooms$(): Observable<Item> {
    return this._rooms
  }

  public fetchRooms(limit: number, startAfter?: Date) {
    this.roomObserver.fetchRooms(limit, startAfter)
  }

  public depose() {
    this._subscription.unsubscribe()
    this.roomObserver.depose()
    this.unreadMessageObserver.deposeAll()
    this.messageObserver.deposeAll()
  }
}
