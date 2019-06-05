import { firestore as firestoreFactory } from 'firebase-admin'
import { ACCOUNT } from '../../../../../src/firebase/collectionSchema';
import { Document as MessageDoc } from '../../../../../src/orm/rxfire/account/message/base'
import { omit } from '../../../../../src/submodule'

export abstract class BaseSentMessageRepository {
  constructor(private firestore: ReturnType<typeof firestoreFactory>) { }

  abstract messageCollectionName(): string

  public send(message: MessageDoc) {
    const messageCollectionName = this.messageCollectionName()
    const collectionPathList = [message.sentFromAccountId, message.sentToAccountId].map(id => `${ACCOUNT.name}/${id}/${messageCollectionName}`)
    const batch = this.firestore.batch()
    collectionPathList.forEach(collectionPath => {
      batch.set(this.firestore.collection(collectionPath).doc(message.id), omit(message, 'id'))
    })
    return batch.commit()
  }
}
