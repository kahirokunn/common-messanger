import * as firebase from 'firebase'
import { Observable, Subject, Subscription } from 'rxjs'
import { Room } from '../../domain/message/room'
import { RoomActivity } from '../../domain/timeline/room'
import { RoomObserver } from './room'
import { UnreadMessageObserver } from './unreadMessageSegments'
import { UnreadMessageSegment } from '../../domain/account/unreadMessageSegment'

export type RoomDoc = Omit<Omit<Room, 'updatedAt'>, 'createdAt'> & {
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

export function roomMapper(roomDoc: RoomDoc): Room {
  return {
    ...roomDoc,
    createdAt: roomDoc.createdAt.toDate(),
    updatedAt: roomDoc.updatedAt.toDate(),
  }
}

type Item = RoomActivity[]
type UnreadMessages = { [roomId: string]: UnreadMessageSegment[string][] }

function isReady(rooms: Room[], unreadMessages: UnreadMessages) {
  for (const room of rooms) {
    if (room.id in unreadMessages === false) {
      return false
    }
  }
  return true
}

function roomActivityMapper(rooms: Room[], unreadMessages: UnreadMessages): RoomActivity[] {
  return rooms.map(room => ({
    ...room,
    unreadMessages: unreadMessages[room.id],
    lastMessage: {} as any,
  }))
}

export class TimelineObserver {
  private readonly _rooms: Subject<Item> = new Subject<Item>()

  constructor(
    private readonly roomObserver: RoomObserver,
    private readonly unreadMessageObserver: UnreadMessageObserver
  ) {
    this
      .roomObserver
      .rooms$
      .pipe(source => {
        const unreadMessages: UnreadMessages = {}
        let allRooms: Room[] = []

        return new Observable<RoomActivity[]>(observer => {
          this.unreadMessageObserver.unreadMessages$.subscribe(data => {
            unreadMessages[data.roomId] = Object.values(data.unreadMessages)
            if (isReady(allRooms, unreadMessages)) {
              observer.next(roomActivityMapper(allRooms, unreadMessages))
            }
          })

          source.subscribe({
            next: (rooms) => {
              allRooms = allRooms.concat(rooms)
              rooms.forEach(
                room => this.unreadMessageObserver.fetchUnreadMessages(room.id)
              )
            },
            error: (e) => observer.error(e),
            complete: () => observer.complete(),
          })
        })
      }).subscribe(this._rooms)
  }

  get rooms$(): Observable<Item> {
    return this._rooms
  }

  public fetchRooms(limit: number, startAfter?: Date) {
    this.roomObserver.fetchRooms(limit, startAfter)
  }

  public depose() {
    this.roomObserver.depose()
    this.unreadMessageObserver.deposeAll()
  }
}
