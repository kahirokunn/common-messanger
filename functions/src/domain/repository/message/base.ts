import { firestore as firestoreFactory } from 'firebase-admin'
import { USER } from '../../../../../src/firebase/collectionSchema';
import { Document as MessageDoc } from '../../../../../src/orm/rxfire/user/message/base'

export abstract class BaseReceiveMessageRepository {
  constructor(private firestore: ReturnType<typeof firestoreFactory>) { }

  abstract messageCollectionName(): string

  public create(message: MessageDoc) {
    const collectionPath = `${USER.name}/${message.sentToAccountId}/${this.messageCollectionName()}`
    return this.firestore.collection(collectionPath).doc().set(message)
  }
}
