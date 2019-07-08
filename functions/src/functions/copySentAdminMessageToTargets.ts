import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ACCOUNT } from '../../../src/firebase/collectionSchema'
import { SentMessageAdminRepository } from '../domain/repository/message/messageAdmin';
import { Document as MessageDoc } from '../../../src/orm/rxfire/account/message/base'
import { pushNotificationByAdmin } from '../domain/repository/pushNotificationByAdmin';
import { isTextMessage, isNoteMessage, isImageMessage } from '../../../src/domain/message';

const firestore = admin.firestore()

const path = `${ACCOUNT.name}/{accountId}/${ACCOUNT.children.SENT_MESSAGE_ADMIN.name}/{messageId}`
export const copySentAdminMessageToTargets = functions
  .firestore
  .document(path)
  .onCreate(async (snap) => {
    const message = { ...snap.data(), id: snap.id } as MessageDoc
    const repository = new SentMessageAdminRepository(firestore)
    await Promise.all([
      repository.send(message),
      pushNotificationByAdmin({
        sentToUid: message.sentToAccountId,
        messageId: message.id,
        messageType: message.type,
        messageText: isTextMessage(message) || isNoteMessage(message) ? message.text : undefined,
        imageUrl: isImageMessage(message) ? message.imageUrl : undefined,
      })
    ])
  })
