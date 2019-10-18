import * as firebase from 'firebase/app'
import { Room, ROOM_TYPE } from '../../../src/domain/message/room'

let id = 0

type Base = Partial<Room> & { memberIds: Room['memberIds'] }

export function roomFactory<T extends Base = never>(overrides: T): Room & T {
  id += 1
  return {
    id,
    name: `${id}nth room`,
    roomType: ROOM_TYPE.DIRECT,
    memberIds: overrides.memberIds,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...overrides,
  }
}
