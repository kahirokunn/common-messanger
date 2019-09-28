import * as firebase from 'firebase'
import { Observable, Subject } from 'rxjs'
import { collectionData } from 'rxfire/firestore'
import { filter, map, takeUntil, finalize } from 'rxjs/operators'
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
  private readonly _unreadMessages$: Subject<UnreadMessagesData> = new Subject<UnreadMessagesData>()

  private readonly _close$: Subject<never> = new Subject()

  get unreadMessages$(): Observable<UnreadMessagesData> {
    return this._unreadMessages$.pipe(finalize(() => this._close$.complete()))
  }

  public fetchUnreadMessages(roomId: Id) {
    connectUnreadMessageSegment(roomId)
      .pipe(takeUntil(this._close$))
      .pipe(map((dataList) => unreadMessageSegmentMapper(dataList.reduce((prev, v) => Object.assign(prev, v), {}))))
      .pipe(map((unreadMessages) => ({ roomId, unreadMessages })))
      .subscribe(this._unreadMessages$)
  }

  public dispose() {
    this._close$.complete()
  }
}
