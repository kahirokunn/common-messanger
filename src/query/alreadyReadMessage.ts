import * as firebase from 'firebase'
import { Observable, Subject } from 'rxjs'
import { collectionData } from 'rxfire/firestore'
import { filter, map, takeUntil, finalize } from 'rxjs/operators'
import { firestore } from '../firebase'
import { getAlreadyReadMessageCollectionName } from '../firebase/collectionSchema'
import { AlreadyReadMessage } from '../domain/account/alreadyReadMessage'
import { Id } from '../firebase/type'
import { getAccountId } from '../firebase/user'
import { toDate } from '../firebase/timestamp'

export type AlreadyReadMessageDoc = Omit<AlreadyReadMessage, 'updatedAt'> & {
  updatedAt: firebase.firestore.Timestamp
}

export function alreadyReadMessageMapper(alreadyReadMessageDoc: AlreadyReadMessageDoc): AlreadyReadMessage {
  return {
    ...alreadyReadMessageDoc,
    updatedAt: toDate(alreadyReadMessageDoc.updatedAt),
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

function connectAlreadyReadMessages(roomId: Id, limit?: number, startAfter?: Date) {
  let query = firestore.collectionGroup(getAlreadyReadMessageCollectionName()).where('roomId', '==', roomId)
  query = getPaginationQuery(query, limit, startAfter)
  return collectionData<AlreadyReadMessageDoc>(query, 'id').pipe(filter((dataList) => dataList.length > 0))
}

type AlreadyReadMessageData = AlreadyReadMessage[]

export class AlreadyReadMessageObserver {
  private readonly _alreadyReadMessage$: Subject<AlreadyReadMessageData> = new Subject()

  private readonly _close$: Subject<never> = new Subject()

  private readonly accountId = getAccountId()

  get alreadyReadMessages$(): Observable<AlreadyReadMessageData> {
    return this._alreadyReadMessage$
      .pipe(finalize(() => this._close$.next()))
      .pipe(map((data) => data.filter((message) => message.readAccountId !== this.accountId)))
  }

  public fetchAlreadyReadMessages(roomId: Id, limit?: number, startAfter?: Date) {
    connectAlreadyReadMessages(roomId, limit, startAfter)
      .pipe(takeUntil(this._close$))
      .pipe(map((alreadyReadMessages) => alreadyReadMessages.map(alreadyReadMessageMapper)))
      .subscribe(this._alreadyReadMessage$)
  }

  public dispose() {
    this._close$.next()
  }
}
