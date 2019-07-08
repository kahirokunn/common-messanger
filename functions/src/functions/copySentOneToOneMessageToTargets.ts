import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ACCOUNT } from '../../../src/firebase/collectionSchema'
import { SentMessageOneToOneRepository } from '../domain/repository/message/messageOneToOne';
import { Document as MessageDoc } from '../../../src/orm/rxfire/account/message/base'

const firestore = admin.firestore()

const path = `${ACCOUNT.name}/{accountId}/${ACCOUNT.children.SENT_MESSAGE_ONE_TO_ONE.name}/{mesasgeId}`
export const copySentOneToOneMessageToTargets = functions
  .firestore
  .document(path)
  .onCreate(async (snap) => {
    const message = { ...snap.data(), id: snap.id } as MessageDoc
    const repository = new SentMessageOneToOneRepository(firestore)
    await repository.send(message)
    console.log('oneToOneのMessageを配信しました')
  })
