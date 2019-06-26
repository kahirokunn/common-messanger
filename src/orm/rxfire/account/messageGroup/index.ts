import { GroupMessage } from '../../../../entity/messageGroup'
import { collectionData } from 'rxfire/firestore'
import { filter, map } from 'rxjs/operators'
import { Timestamp } from '../../../../firebase/type'
import { firestore } from '../../../../firebase'
import { buildGroupMessageCollectionPath } from '../../../../firebase/collectionSchema'
import { getPaginationQuery } from '../message/base'
import { getOwnId } from '../../../../domain/auth'

export type Document = GroupMessage & { createdAt: Timestamp }

export function messageMapper(messageDocRef: Document): GroupMessage {
  return {
    ...messageDocRef,
    createdAt: messageDocRef.createdAt.toDate(),
  }
}

export class MessageGroupObservable {
  public factory(memberIds: Array<string>, groupId: string, limit: number, startAfter?: Date) {
    const collectionPath = buildGroupMessageCollectionPath({ accountId: getOwnId(), groupId })
    const query = firestore.collection(collectionPath)

    return collectionData<Document>(getPaginationQuery(query, limit, startAfter), 'id')
      .pipe(filter((dataList) => dataList.length > 0))
      .pipe(map((dataList) => dataList.map(messageMapper)))
  }
}
