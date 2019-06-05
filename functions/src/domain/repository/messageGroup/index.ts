import { firestore as firestoreFactory } from 'firebase-admin'
import { GROUP, buildGroupMessageCollectionPath } from '../../../../../src/firebase/collectionSchema'
import { Document as MessageDoc } from '../../../../../src/orm/rxfire/user/messageGroup'
import { omit } from '../../../../../src/submodule'
import { Group as GroupEntity } from '../../../../../src/entity/group'

export class MessageGroupRepository {
  constructor(private firestore: ReturnType<typeof firestoreFactory>) { }

  public async send(message: MessageDoc) {
    const snap = await this.firestore.collection(GROUP.name).doc(message.groupId).get()
    const group = { ...snap.data(), id: snap.id } as GroupEntity
    const collectionPathList = group.memberIds.map(accountId => buildGroupMessageCollectionPath({
      accountId,
      groupId: group.id
    }))
    const batch = this.firestore.batch()
    collectionPathList.forEach(collectionPath => {
      batch.set(this.firestore.collection(collectionPath).doc(`receive_${message.id}`), omit(message, 'id'))
    })
    return batch.commit()
  }
}
