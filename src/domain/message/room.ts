import { Id } from '../../firebase/type'

export enum ROOM_TYPE {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  ADMIN = 'ADMIN',
}

export type Room = {
  id: Id
  name: string
  roomType: ROOM_TYPE
  memberIds: [Id, Id, ...Id[]]
  createdAt: Date
  updatedAt: Date
}
