import { Id } from '../../firebase/type'

export type AlreadyReadMessage = {
  roomId: Id
  readAccountId: Id
  updatedAt: Date
}
