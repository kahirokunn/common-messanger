import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { USER } from '../../../src/firebase/collectionSchema'
import { SentMessageOneToOneRepository } from '../domain/repository/message/messageOneToOne';
import { Document as MessageDoc } from '../../../src/orm/rxfire/user/message/base'

const firestore = admin.firestore()

const path = `${USER.name}/{userId}/${USER.children.SENT_MESSAGE_ADMIN.name}/{messageId}`
export const copySentAdminMessageToTargets = functions
  .firestore
  .document(path)
  .onCreate((snap, context) => {
    const { messageId } = context.params
    const message = { ...snap.data(), id: messageId } as MessageDoc
    return new SentMessageOneToOneRepository(firestore)
      .send(message, [message.sentFromAccountId, message.sentToAccountId])
      .then(() => console.log('adminのMessageを受信しました'))
  })
