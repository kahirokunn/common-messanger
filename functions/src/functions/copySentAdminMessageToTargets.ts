import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ACCOUNT } from '../../../src/firebase/collectionSchema'
import { SentMessageAdminRepository } from '../domain/repository/message/messageAdmin';
import { Document as MessageDoc } from '../../../src/orm/rxfire/account/message/base'

const firestore = admin.firestore()

const path = `${ACCOUNT.name}/{accountId}/${ACCOUNT.children.SENT_MESSAGE_ADMIN.name}/{messageId}`
export const copySentAdminMessageToTargets = functions
  .firestore
  .document(path)
  .onCreate((snap) => {
    const message = { ...snap.data(), id: snap.id } as MessageDoc
    return new SentMessageAdminRepository(firestore)
      .send(message)
      .then(() => console.log('adminのMessageを配信しました'))
  })
