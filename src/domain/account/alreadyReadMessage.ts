import { Id } from '../../firebase/type'

export type AlreadyReadMessage = {
  id: Id
  roomId: Id
  readAccountId: Id
  updatedAt: Date
}
