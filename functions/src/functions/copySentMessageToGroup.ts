import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { GROUP } from '../../../src/firebase/collectionSchema'
import { MessageGroupRepository } from '../domain/repository/messageGroup';
import { Document as MessageDoc } from '../../../src/orm/rxfire/account/messageGroup'
import { pushNotificationByGroup } from '../domain/repository/pushNotificationByGroup';
import { GroupRepository } from '../domain/repository/group';
import { isTextMessage, isNoteMessage, isImageMessage } from '../../../src/domain/messageGroup';

const firestore = admin.firestore()

const path = `${GROUP.name}/{groupId}/${GROUP.children.SENT.name}/{messageId}`
export const copySentMessageToGroup = functions
  .firestore
  .document(path)
  .onCreate(async (snap) => {
    const message = { ...snap.data(), id: snap.id } as MessageDoc
    const groupRepository = new GroupRepository(firestore)
    const group = await groupRepository.get(message.groupId)
    const repository = new MessageGroupRepository(firestore)
    await Promise.all([
      repository.send(group, message),
      pushNotificationByGroup({
        sentFrom: message.sentFromAccountId,
        // 送信者以外に通知
        sentToUids: message.memberIds.filter(id => id !== message.sentFromAccountId),
        groupId: group.id,
        messageId: message.id,
        messageType: message.type,
        messageText: isTextMessage(message) || isNoteMessage(message) ? message.text : undefined,
        imageUrl: isImageMessage(message) ? message.imageUrl : undefined,
      })
    ])
  })
