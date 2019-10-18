import * as firebase from 'firebase'
import { Observable, Subject } from 'rxjs'
import { collectionData } from 'rxfire/firestore'
import { filter, map, takeUntil, finalize } from 'rxjs/operators'
import { firestore } from '../../firebase'
import { getRoomPath } from '../../firebase/collectionSchema'
import { Room } from '../../domain/message/room'
import { toDate } from '../../firebase/timestamp'

export type RoomDoc = Omit<Omit<Room, 'updatedAt'>, 'createdAt'> & {
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

export function roomMapper(roomDoc: RoomDoc): Room {
  return {
    ...roomDoc,
    createdAt: toDate(roomDoc.createdAt),
    updatedAt: toDate(roomDoc.updatedAt),
  }
}

function getPaginationQuery(query: firebase.firestore.Query, limit?: number, startAfter?: Date) {
  let newQuery = query.orderBy('updatedAt', 'desc')

  if (typeof limit !== 'undefined') {
    newQuery = newQuery.limit(limit)
  }

  if (startAfter) {
    newQuery = newQuery.startAfter(startAfter)
  }
  return newQuery
}

function connectRoom(limit?: number, startAfter?: Date) {
  const { currentUser } = firebase.auth()
  if (!currentUser) {
    throw Error('failed to get current user from firebase auth sdk')
  }
  let query = firestore.collection(getRoomPath()).where('memberIds', 'array-contains', currentUser.uid)
  query = getPaginationQuery(query, limit, startAfter)
  return collectionData<RoomDoc>(query, 'id').pipe(filter((dataList) => dataList.length > 0))
}

export type RoomsData = Room[]

export class RoomObserver {
  private readonly _rooms$: Subject<RoomsData> = new Subject<RoomsData>()

  private readonly _close$: Subject<never> = new Subject()

  get rooms$(): Observable<RoomsData> {
    return this._rooms$.pipe(finalize(() => this._close$.next()))
  }

  public fetchRooms(limit?: number, startAfter?: Date) {
    connectRoom(limit, startAfter)
      .pipe(takeUntil(this._close$))
      .pipe(map((rooms) => rooms.map(roomMapper)))
      .subscribe(this._rooms$)
  }

  public dispose() {
    this._close$.next()
  }
}
