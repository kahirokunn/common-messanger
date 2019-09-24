import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { getMessagePath, getRoomPath, getUnreadMessageSegmentPath } from '../../../src/firebase/collectionSchema'
import { MessageDoc } from '../../../src/query/message'
import { Id } from '../../../src/firebase/type'
import { Room } from '../../../src/domain/message/room'
import { getRandomNodeId } from '../../../src/domain/distributedCounter/index'

// 分散カウンタのnode数
const DISTRIBUTED_COUNTER_NODE_SIZE = Number(process.env.DISTRIBUTED_COUNTER_NODE_SIZE) || 5
const firestore = admin.firestore()

const path = `${getMessagePath('{roomId}')}/{messageId}`

async function fetchRoomById(roomId: Id) {
  const snap = await firestore
    .collection(getRoomPath())
    .doc(roomId)
    .get()
  const room = { ...snap.data(), id: snap.id } as Room
  return room
}

export const insertGroupMembersUnreadMessageSegmnent = functions.firestore.document(path).onCreate(async (snap, context) => {
  const message = snap.data() as Omit<MessageDoc, 'id'>
  const { roomId } = context.params
  const room = await fetchRoomById(roomId)
  const batch = firestore.batch()

  room.memberIds
    .filter((memberId) => memberId !== message.sentFromAccountId)
    .map((memberId) => getUnreadMessageSegmentPath(memberId, roomId))
    .forEach((collectionPath) => {
      batch.set(
        firestore.collection(collectionPath).doc(getRandomNodeId(DISTRIBUTED_COUNTER_NODE_SIZE)),
        { [snap.id]: message },
        { merge: true },
      )
    })
  await batch.commit()
})
