import * as firebase from 'firebase'
import { Observable, Subject, Subscription } from 'rxjs'
import { collectionData } from 'rxfire/firestore';
import { filter, map } from 'rxjs/operators';
import { firestore } from '../../firebase';
import { getRoomPath } from '../../firebase/collectionSchema';
import { Room } from '../../domain/message/room';

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

function getPaginationQuery(query: firebase.firestore.Query, limit: number, startAfter?: Date) {
  query = query.orderBy('updatedAt', 'desc').limit(limit)
  if (startAfter) {
    query = query.startAfter(startAfter)
  }
  return query
}

function connectRoom(limit: number, startAfter?: Date) {
  const { currentUser } = firebase.auth()
  if (!currentUser) {
    throw Error('failed to get current user from firebase auth sdk')
  }
  let query = firestore
    .collection(getRoomPath())
    .where('memberIds', 'array-contains', currentUser.uid)
  query = getPaginationQuery(query, limit, startAfter)
  return collectionData<RoomDoc>(query, 'id')
    .pipe(filter((dataList) => dataList.length > 0))
}

export type RoomsData = Room[]

export class RoomObserver {
  private readonly _rooms: Subject<RoomsData> = new Subject<RoomsData>()
  private _subscriptions: Subscription[] = []

  get rooms$(): Observable<RoomsData> {
    return this._rooms
  }

  public fetchRooms(limit: number, startAfter?: Date) {
    const subscription = connectRoom(limit, startAfter)
      .pipe(map(rooms => rooms.map(roomMapper)))
      .subscribe(this._rooms)

    this._subscriptions.push(subscription)
  }

  public depose() {
    this._subscriptions
      .forEach((subscription) => subscription.unsubscribe())
    this._subscriptions = []
  }
}
