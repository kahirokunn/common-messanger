import { firebase, firestore } from '../../firebase'
import { AlreadyReadMessage } from '../../domain/account/alreadyReadMessage'
import { getAlreadyReadMessagePath } from '../../firebase/collectionSchema'

type Input = Omit<Omit<Omit<AlreadyReadMessage, 'id'>, 'updatedAt'>, 'readAccountId'> & { accountId: AlreadyReadMessage['readAccountId'] }
type DTO = Omit<Omit<AlreadyReadMessage, 'id'>, 'updatedAt'> & { updatedAt: firebase.firestore.FieldValue }

function mapEntityToDTO(entity: Input): DTO {
  return {
    roomId: entity.roomId,
    readAccountId: entity.accountId,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }
}

export function saveAlreadyReadMessage(input: Input) {
  return firestore
    .collection(getAlreadyReadMessagePath(input.accountId, input.roomId))
    .doc(input.accountId)
    .set(mapEntityToDTO(input))
}
