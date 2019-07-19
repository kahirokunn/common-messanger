import { Id } from "./type";

export enum ROOM_TYPE {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
  ADMIN = 'ADMIN',
}

export type Room = {
  id: Id
  name: string
  roomType: ROOM_TYPE
  memberIds: Array<Id>
}
