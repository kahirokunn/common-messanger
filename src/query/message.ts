import firebase from 'firebase'
import { Observable, Subject, Subscription } from 'rxjs'
import { collectionData } from 'rxfire/firestore';
import { filter, map } from 'rxjs/operators';
import { Message } from '../domain/message/entity';
import { Id } from '../domain/message/type';
import { firestore } from '../firebase';
import { getMessagePath } from '../firebase/collectionSchema';

export type Document = Message & { createdAt: firebase.firestore.Timestamp }

export function messageMapper(messageDocRef: Document): Message {
  return {
    ...messageDocRef,
    createdAt: messageDocRef.createdAt.toDate(),
  }
}

export function getPaginationQuery(query: firebase.firestore.Query, limit: number, startAfter?: Date) {
  query = query.orderBy('createdAt', 'desc').limit(limit)
  if (startAfter) {
    query = query.startAfter(startAfter)
  }
  return query
}

function connectMessage(roomId: Id, limit: number, startAfter?: Date) {
  const query = firestore.collection(getMessagePath(roomId))
  return collectionData<Document>(getPaginationQuery(query, limit, startAfter), 'id')
    .pipe(filter((dataList) => dataList.length > 0))
    .pipe(map((dataList) => dataList.map(messageMapper)))
}

export class MessageObserver {
  private readonly _messages: Subject<Message[]> = new Subject<Message[]>()
  private readonly _subscriptions: Subscription[] = []

  constructor(private readonly roomId: Id) { }

  get messages$(): Observable<Message[]> {
    return this._messages
  }

  public fetchMessage(limit: number, startAfter?: Date) {
    const subscription = connectMessage(this.roomId, limit, startAfter).subscribe(this._messages)
    this._subscriptions.push(subscription)
  }

  public depose() {
    this._subscriptions
      .map((subscription) => subscription.unsubscribe())
  }
}
