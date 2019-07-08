import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { ACCOUNT } from '../../../src/firebase/collectionSchema'
import { SentMessageOneToOneRepository } from '../domain/repository/message/messageOneToOne';
import { Document as MessageDoc } from '../../../src/orm/rxfire/account/message/base'
import { pushNotificationByOneToOne } from '../domain/repository/pushNotificationByOneToOne';
import { isTextMessage, isImageMessage, isNoteMessage } from '../../../src/domain/message';

const firestore = admin.firestore()

const path = `${ACCOUNT.name}/{accountId}/${ACCOUNT.children.SENT_MESSAGE_ONE_TO_ONE.name}/{mesasgeId}`
export const copySentOneToOneMessageToTargets = functions
  .firestore
  .document(path)
  .onCreate(async (snap) => {
    const message = { ...snap.data(), id: snap.id } as MessageDoc
    const repository = new SentMessageOneToOneRepository(firestore)
    // Promise allをしている理由
    // message copyはpush notificationより早いはず
    // push通知はapiが処理し、その後push通史platform経由で各種端末にばらまかれ、
    // それからタップされるのだが、その一連の流れよりかは早いだろうという期待
    await Promise.all([
      repository.send(message),
      pushNotificationByOneToOne({
        sentFrom: message.sentFromAccountId,
        sentToUid: message.sentToAccountId,
        messageId: message.id,
        messageType: message.type,
        messageText: isTextMessage(message) || isNoteMessage(message) ? message.text : undefined,
        imageUrl: isImageMessage(message) ? message.imageUrl : undefined,
      })
    ])
  })
