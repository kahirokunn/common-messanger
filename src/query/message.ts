import * as firebase from 'firebase'
import { Observable, Subject } from 'rxjs'
import { collectionData } from 'rxfire/firestore'
import { filter, map, takeUntil, finalize } from 'rxjs/operators'
import { Message } from '../domain/message/message'
import { Id } from '../firebase/type'
import { firestore } from '../firebase'
import { getMessagePath } from '../firebase/collectionSchema'
import { toDate } from '../firebase/timestamp'

export type MessageDoc = Message & { createdAt: firebase.firestore.Timestamp }

export function messageMapper(messageDocRef: MessageDoc): Message {
  return {
    ...messageDocRef,
    createdAt: toDate(messageDocRef.createdAt),
  }
}

function getPaginationQuery(query: firebase.firestore.Query, limit?: number, startAfter?: Date) {
  let newQuery = query.orderBy('createdAt', 'desc')

  if (typeof limit !== 'undefined') {
    newQuery = newQuery.limit(limit)
  }
  if (startAfter) {
    newQuery = newQuery.startAfter(startAfter)
  }
  return newQuery
}

function connectMessage(roomId: Id, limit?: number, startAfter?: Date) {
  const query = firestore.collection(getMessagePath(roomId))
  return collectionData<MessageDoc>(getPaginationQuery(query, limit, startAfter), 'id').pipe(filter((dataList) => dataList.length > 0))
}

export type MessagesData = { roomId: Id; messages: Message[] }

export class MessageObserver {
  private readonly _messages$: Subject<MessagesData> = new Subject()

  private readonly _close$: Subject<never> = new Subject()

  get messages$(): Observable<MessagesData> {
    return this._messages$.pipe(finalize(() => this._close$.next()))
  }

  public fetchMessage(roomId: Id, limit?: number, startAfter?: Date) {
    connectMessage(roomId, limit, startAfter)
      .pipe(map((dataList) => ({ roomId, messages: dataList.map(messageMapper) })))
      .pipe(takeUntil(this._close$))
      .subscribe(this._messages$)
  }

  public dispose() {
    this._close$.next()
  }
}
