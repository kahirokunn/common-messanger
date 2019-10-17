import { Observable, Subject, merge } from 'rxjs'
import { tap, takeUntil, finalize } from 'rxjs/operators'
import { Room } from '../../domain/message/room'
import { RoomActivity } from '../../domain/timeline/room'
import { RoomObserver } from './room'
import { UnreadMessageObserver } from './unreadMessageSegments'
import { UnreadMessageSegment } from '../../domain/account/unreadMessageSegment'
import { Message } from '../../domain/message/message'
import { MessageObserver } from '../message'
import { toDate } from '../../firebase/timestamp'

export type RoomDoc = Omit<Omit<Room, 'updatedAt'>, 'createdAt'> & {
  createdAt: import('firebase').firestore.Timestamp
  updatedAt: import('firebase').firestore.Timestamp
}

export function roomMapper(roomDoc: RoomDoc): Room {
  return {
    ...roomDoc,
    createdAt: toDate(roomDoc.createdAt),
    updatedAt: toDate(roomDoc.updatedAt),
  }
}

type Item = RoomActivity[]
type KV<T> = { [roomId: string]: T }
type UnreadMessages = KV<UnreadMessageSegment[string][]>
type LastMessages = KV<Message>

function roomActivityMapper(rooms: Room[], unreadMessages: UnreadMessages, lastMessages: LastMessages): RoomActivity[] {
  return rooms.map((room) => ({
    ...room,
    unreadMessages: unreadMessages[room.id] || [],
    lastMessage: lastMessages[room.id] || null,
  }))
}

export class TimelineObserver {
  private readonly _rooms$: Subject<Item> = new Subject<Item>()

  private readonly _close$: Subject<never> = new Subject()

  constructor(
    private readonly roomObserver: RoomObserver,
    private readonly unreadMessageObserver: UnreadMessageObserver,
    private readonly messageObserver: MessageObserver,
  ) {
    let allRooms: Room[] = []
    const unreadMessages: UnreadMessages = {}
    const lastMessages: LastMessages = {}

    merge(
      this.roomObserver.rooms$.pipe(takeUntil(this._close$)).pipe(
        tap((rooms) => {
          allRooms = rooms
          rooms.forEach((room) => {
            this.messageObserver.fetchMessage(room.id, 1)
            this.unreadMessageObserver.fetchUnreadMessages(room.id)
          })
        }),
      ),
      this.unreadMessageObserver.unreadMessages$.pipe(takeUntil(this._close$)).pipe(
        tap((data) => {
          unreadMessages[data.roomId] = Object.values(data.unreadMessages)
        }),
      ),
      this.messageObserver.messages$.pipe(takeUntil(this._close$)).pipe(
        tap((data) => {
          lastMessages[data.roomId] = data.messages[0]
        }),
      ),
    )
      .pipe(takeUntil(this._close$))
      .subscribe({
        next: () => {
          this._rooms$.next(roomActivityMapper(allRooms, unreadMessages, lastMessages))
        },
        error: (error) => {
          this._rooms$.error(error)
        },
      })
  }

  get rooms$(): Observable<Item> {
    return this._rooms$.pipe(finalize(() => this._close$.next()))
  }

  public fetchRooms(limit?: number, startAfter?: Date) {
    this.roomObserver.fetchRooms(limit, startAfter)
  }

  public dispose() {
    this._close$.next()
  }
}
