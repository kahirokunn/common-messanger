import { firebase, firestore } from "../../firebase"
import { getUnreadMessageSegmentPath } from "../../firebase/collectionSchema"
import { UnreadMessageSegment } from "../../domain/account/unreadMessageSegment"
import { Id } from "../../firebase/type"
import { Message } from "../../domain/message/message"
import { UnreadMessageSegmentDoc } from "../../query/timeline/unreadMessageSegments";

export async function readMessage(roomId: Id, beginAt: Date, endAt: Date): Promise<void> {
  const currentUser = firebase.auth().currentUser
  if (!currentUser) {
    throw Error('failed to get current user from firebase auth sdk')
  }

  const unreadMessageSegments = await getAllUnreadMessageSegmentSnapshot(currentUser.uid, roomId)
  const batch = firestore.batch()
  removeReadMessages({
    roomId,
    batch,
    accountId: currentUser.uid,
    beginAt,
    endAt,
    unreadMessageSegments
  })
  await batch.commit()
}

type Input = {
  batch: firebase.firestore.WriteBatch,
  accountId: Id,
  roomId: Id,
  beginAt: Date,
  endAt: Date,
  unreadMessageSegments: UnreadMessageSegmentWithId
}
function removeReadMessages(input: Input) {
  const removeTargets = getRemoveTargets(input)
  Object.keys(removeTargets).forEach(segmentId => {
    Object.keys(removeTargets[segmentId]).forEach(messageId => {
      input.batch.update(
        firestore
          .collection(`${getUnreadMessageSegmentPath(input.accountId, input.roomId)}`)
          .doc(segmentId),
        { [messageId]: firebase.firestore.FieldValue.delete() }
      )
    })
  })
}

function getRemoveTargets(input: Input) {
  const removeTargetSegments: UnreadMessageSegmentWithId = {}
  Object.keys(input.unreadMessageSegments).forEach(segmentId => {
    removeTargetSegments[segmentId] = {}
    const unreadMessageSegment = input.unreadMessageSegments[segmentId]
    const messages = mapToMessages(unreadMessageSegment)
    messages
      .filter(message => input.beginAt <= message.createdAt && message.createdAt <= input.endAt)
      .forEach(message => removeTargetSegments[segmentId][message.id] = message)
  })
  return removeTargetSegments
}

function mapToMessages(unreadMessageSegment: UnreadMessageSegment): Message[] {
  return Object.keys(unreadMessageSegment).map(messageId => ({
    id: messageId,
    ...unreadMessageSegment[messageId]
  } as Message))
}

type UnreadMessageSegmentWithId = { [id: string]: UnreadMessageSegment }
async function getAllUnreadMessageSegmentSnapshot(accountId: Id, roomId: Id): Promise<UnreadMessageSegmentWithId> {
  const unreadMessageSegmentsQuerySnap = await firestore
    .collection(getUnreadMessageSegmentPath(accountId, roomId))
    .get()
  const output: UnreadMessageSegmentWithId = {}
  unreadMessageSegmentsQuerySnap.forEach(unreadMessageSegmentDocSnap => {
    output[unreadMessageSegmentDocSnap.id] = {}
    const unreadMessageSegmentDoc: UnreadMessageSegmentDoc = unreadMessageSegmentDocSnap.data()
    Object.keys(unreadMessageSegmentDoc).forEach(messageId => {
      output[unreadMessageSegmentDocSnap.id][messageId] = {
        ...unreadMessageSegmentDoc[messageId],
        createdAt: unreadMessageSegmentDoc[messageId].createdAt.toDate()
      }
    })
  })

  return output
}