import { Id } from '../../firebase/type'
import { getAccountId } from '../../firebase/user'
import { saveAlreadyReadMessage } from './saveAlreadyReadMessage'
import { sliceUnreadMessageSegment } from './sliceUnreadMessageSegment'

export async function readMessage(roomId: Id, beginAt: Date, endAt: Date): Promise<void> {
  const accountId = getAccountId()
  await Promise.all([
    saveAlreadyReadMessage({
      accountId,
      roomId,
    }),
    sliceUnreadMessageSegment(accountId, roomId, beginAt, endAt),
  ])
}
