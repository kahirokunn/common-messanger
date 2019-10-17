import { firebase, firestore } from '../../firebase'
import { getUnreadMessageSegmentPath } from '../../firebase/collectionSchema'
import { UnreadMessageSegment } from '../../domain/account/unreadMessageSegment'
import { Id } from '../../firebase/type'
import { Message } from '../../domain/message/message'
import { UnreadMessageSegmentDoc } from '../../query/timeline/unreadMessageSegments'
import { toDate } from '../../firebase/timestamp'

type Input = {
  batch: firebase.firestore.WriteBatch
  accountId: Id
  roomId: Id
  beginAt: Date
  endAt: Date
  unreadMessageSegments: UnreadMessageSegmentWithId
}

function mapToMessages(unreadMessageSegment: UnreadMessageSegment): Message[] {
  return Object.keys(unreadMessageSegment).map(
    (messageId) =>
      ({
        id: messageId,
        ...unreadMessageSegment[messageId],
      } as Message),
  )
}

function getRemoveTargets(input: Input) {
  const removeTargetSegments: UnreadMessageSegmentWithId = {}
  Object.keys(input.unreadMessageSegments).forEach((segmentId) => {
    removeTargetSegments[segmentId] = {}
    const unreadMessageSegment = input.unreadMessageSegments[segmentId]
    const messages = mapToMessages(unreadMessageSegment)
    messages
      .filter((message) => input.beginAt <= message.createdAt && message.createdAt <= input.endAt)
      .forEach((message) => {
        removeTargetSegments[segmentId][message.id] = message
      })
  })
  return removeTargetSegments
}

function removeReadMessages(input: Input) {
  const removeTargets = getRemoveTargets(input)
  Object.keys(removeTargets).forEach((segmentId) => {
    Object.keys(removeTargets[segmentId]).forEach((messageId) => {
      input.batch.update(firestore.collection(`${getUnreadMessageSegmentPath(input.accountId, input.roomId)}`).doc(segmentId), {
        [messageId]: firebase.firestore.FieldValue.delete(),
      })
    })
  })
}

type UnreadMessageSegmentWithId = { [id: string]: UnreadMessageSegment }
async function getAllUnreadMessageSegmentSnapshot(accountId: Id, roomId: Id): Promise<UnreadMessageSegmentWithId> {
  const unreadMessageSegmentsQuerySnap = await firestore.collection(getUnreadMessageSegmentPath(accountId, roomId)).get()
  const output: UnreadMessageSegmentWithId = {}
  unreadMessageSegmentsQuerySnap.forEach((unreadMessageSegmentDocSnap) => {
    output[unreadMessageSegmentDocSnap.id] = {}
    const unreadMessageSegmentDoc: UnreadMessageSegmentDoc = unreadMessageSegmentDocSnap.data()
    Object.keys(unreadMessageSegmentDoc).forEach((messageId) => {
      output[unreadMessageSegmentDocSnap.id][messageId] = {
        ...unreadMessageSegmentDoc[messageId],
        createdAt: toDate(unreadMessageSegmentDoc[messageId].createdAt),
      }
    })
  })

  return output
}

export async function sliceUnreadMessageSegment(accountId: Id, roomId: Id, beginAt: Date, endAt: Date): Promise<void> {
  const unreadMessageSegments = await getAllUnreadMessageSegmentSnapshot(accountId, roomId)
  const batch = firestore.batch()
  removeReadMessages({
    roomId,
    batch,
    accountId,
    beginAt,
    endAt,
    unreadMessageSegments,
  })
  await batch.commit()
}
