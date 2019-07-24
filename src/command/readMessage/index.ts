import { firebase, firestore } from "../../firebase";
import { getAccountRoomPath } from "../../firebase/collectionSchema";
import { Room } from "../../domain/account/room";


export async function readMessage(room: Room): Promise<void> {
  await updateRoom(room)
}

function updateRoom(room: Room) {
  const currentUser = firebase.auth().currentUser
  if (currentUser) {
    return firestore
      .collection(getAccountRoomPath(currentUser.uid))
      .doc(room.id)
      .set(mapEntityToDTO(room))
  }
  throw Error('failed to get current user from firebase auth sdk')
}

type RoomDTO = Omit<Room, 'id'>

function mapEntityToDTO(room: Room): RoomDTO {
  return {
    beginAt: room.beginAt,
    endAt: room.endAt
  }
}
