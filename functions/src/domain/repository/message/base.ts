import { firestore as firestoreFactory } from 'firebase-admin'
import { USER } from '../../../../../src/firebase/collectionSchema';
import { Document as MessageDoc } from '../../../../../src/orm/rxfire/user/message/base'
import { omit } from '../../../../../src/submodule'

export abstract class BaseSentMessageRepository {
  constructor(private firestore: ReturnType<typeof firestoreFactory>) { }

  abstract messageCollectionName(): string

  public send(message: MessageDoc, sentToIds: string[]) {
    const messageCollectionName = this.messageCollectionName()
    const collectionPathList = sentToIds.map(id => `${USER.name}/${id}/${messageCollectionName}`)
    const batch = this.firestore.batch()
    collectionPathList.forEach(collectionPath => {
      batch.set(this.firestore.collection(collectionPath).doc(`receive_${message.id}`), omit(message, 'id'))
    })
    return batch.commit()
  }
}
