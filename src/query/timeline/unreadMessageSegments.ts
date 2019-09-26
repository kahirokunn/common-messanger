import * as firebase from 'firebase'
import { Observable, Subject, Subscription } from 'rxjs'
import { collectionData } from 'rxfire/firestore'
import { filter, map } from 'rxjs/operators'
import { UnreadMessageSegment } from '../../domain/account/unreadMessageSegment'
import { MessageDoc } from '../message'
import { firestore } from '../../firebase'
import { getUnreadMessageSegmentPath } from '../../firebase/collectionSchema'
import { Id } from '../../firebase/type'

export type UnreadMessageSegmentDoc = { [id: string]: MessageDoc }

export function unreadMessageSegmentMapper(unreadMessageSegmentDoc: UnreadMessageSegmentDoc): UnreadMessageSegment {
  const unreadMessageSegment: UnreadMessageSegment = {}
  Object.keys(unreadMessageSegmentDoc).forEach((id) => {
    unreadMessageSegment[id] = {
      ...unreadMessageSegmentDoc[id],
      createdAt: unreadMessageSegmentDoc[id].createdAt.toDate(),
    }
  })
  return unreadMessageSegment
}

function connectUnreadMessageSegment(roomId: Id) {
  const { currentUser } = firebase.auth()
  if (!currentUser) {
    throw Error('failed to get current user from firebase auth sdk')
  }
  const query = firestore.collection(getUnreadMessageSegmentPath(currentUser.uid, roomId))
  return collectionData<UnreadMessageSegmentDoc>(query).pipe(filter((dataList) => dataList.length > 0))
}

export type UnreadMessagesData = { roomId: Id; unreadMessages: UnreadMessageSegment }

export class UnreadMessageObserver {
  private readonly _unreadMessages: Subject<UnreadMessagesData> = new Subject<UnreadMessagesData>()

  private _subscriptions: { [roomId: string]: Subscription[] } = {}

  get unreadMessages$(): Observable<UnreadMessagesData> {
    return this._unreadMessages
  }

  public fetchUnreadMessages(roomId: Id) {
    const subscription = connectUnreadMessageSegment(roomId)
      .pipe(map((dataList) => unreadMessageSegmentMapper(dataList.reduce((prev, v) => Object.assign(prev, v), {}))))
      .pipe(map((unreadMessages) => ({ roomId, unreadMessages })))
      .subscribe(this._unreadMessages)

    if (!this._subscriptions[roomId]) {
      this._subscriptions[roomId] = []
    }
    this._subscriptions[roomId].push(subscription)
  }

  public dispose(roomId: Id) {
    if (this._subscriptions[roomId]) {
      this._subscriptions[roomId].forEach((subscription) => subscription.unsubscribe())
      this._subscriptions[roomId] = []
    }
  }

  public disposeAll() {
    Object.keys(this._subscriptions).forEach((roomId) => {
      this._subscriptions[roomId].forEach((subscription) => subscription.unsubscribe())
    })
    this._subscriptions = {}
  }
}
