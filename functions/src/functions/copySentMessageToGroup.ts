import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { GROUP } from '../../../src/firebase/collectionSchema'
import { MessageGroupRepository } from '../domain/repository/messageGroup';
import { Document as MessageDoc } from '../../../src/orm/rxfire/account/messageGroup'

const firestore = admin.firestore()

const path = `${GROUP.name}/{groupId}/${GROUP.children.SENT.name}/{messageId}`
export const copySentMessageToGroup = functions
  .firestore
  .document(path)
  .onCreate(async (snap) => {
    const message = { ...snap.data(), id: snap.id } as MessageDoc
    const repository = new MessageGroupRepository(firestore)
    await repository.send(message)
    console.log('groupのMessageを配信しました')
  })
