import * as firebase from 'firebase/app'
import uuid from 'uuid/v4'
import { AlreadyReadMessage } from '../../../src/domain/account/alreadyReadMessage'

export function alreadyReadMessageFactory<T extends Partial<AlreadyReadMessage>>(overrides: T): AlreadyReadMessage & T {
  const readAccountId = uuid()
  return {
    id: readAccountId,
    roomId: uuid(),
    readAccountId,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...overrides,
  }
}
