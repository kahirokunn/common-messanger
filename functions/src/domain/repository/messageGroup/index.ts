import { firestore as firestoreFactory } from 'firebase-admin'
import { buildGroupMessageCollectionPath } from '../../../../../src/firebase/collectionSchema'
import { Document as MessageDoc } from '../../../../../src/orm/rxfire/account/messageGroup'
import { omit } from '../../../../../src/submodule'
import { Group as GroupEntity } from '../../../../../src/entity/group'

export class MessageGroupRepository {
  constructor(private firestore: ReturnType<typeof firestoreFactory>) { }

  public async send(group: GroupEntity, message: MessageDoc) {
    const collectionPathList = message.memberIds.map(accountId => buildGroupMessageCollectionPath({
      accountId,
      groupId: group.id
    }))
    const batch = this.firestore.batch()
    collectionPathList.forEach(collectionPath => {
      batch.set(this.firestore.collection(collectionPath).doc(message.id), omit(message, 'id'))
    })
    return batch.commit()
  }
}
