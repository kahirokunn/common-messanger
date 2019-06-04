import { GroupMessage } from '../../../../entity/messageGroup'
import { collectionData } from 'rxfire/firestore'
import { filter, map } from 'rxjs/operators'
import { Timestamp } from '../../../../firebase/type'
import { firestore } from '../../../../firebase';
import { GROUP } from '../../../../firebase/collectionSchema';
import { getPaginationQuery } from '../message/base';

export type Document = GroupMessage & { createdAt: Timestamp }

export function messageMapper(messageDocRef: Document): GroupMessage {
  return {
    ...messageDocRef,
    createdAt: messageDocRef.createdAt.toDate(),
  }
}

export class MessageGroupObservable {
  public factory(groupId: string, limit: number, startAfter?: Date) {
    const collectionPath = `${GROUP.name}/${groupId}/${GROUP.children.SENT.name}}`
    const query = firestore.collection(collectionPath)

    return collectionData<Document>(getPaginationQuery(query, limit, startAfter), 'id')
      .pipe(filter((dataList) => dataList.length > 0))
      .pipe(map((dataList) => dataList.map(messageMapper)))
  }
}
