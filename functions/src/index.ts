import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { USER } from '../../src/firebase/collectionSchema'
import { Message } from '../../src/entity/message'
import { ReceiveMessageOneToOneRepository } from './domain/repository/message/messageOneToOne';

admin.initializeApp(functions.config().firebase)
const firestore = admin.firestore()

const path = `${USER.name}/{userId}/${USER.children.MESSAGE_ONE_TO_ONE}/{messageId}`
export const copyOneToOneMessageToSentToAccountId = functions
  .firestore
  .document(path)
  .onCreate((snap, context) => {
    // admin sdk経由で呼ばれた場合は抜ける
    if (context.authType === 'ADMIN') {
      return
    }
    const { messageId } = context.params
    const message = { ...snap.data(), id: messageId } as Message
    return new ReceiveMessageOneToOneRepository(firestore).create(message).then(() => console.log('oneToOneのMessageを受信しました'))
  })
