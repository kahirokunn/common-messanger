import { firebase, firestore } from "../../../firebase";
import {
  GroupTextMessage,
  GroupNoteMessage,
  GroupImageMessage,
  GroupMessageType,
} from "../../../entity/messageGroup";
import { Omit } from "../../../submodule/type";
import { GROUP, sentMessageCollectionPath } from "../../../firebase/collectionSchema";

type OmitIdTextMessage = Omit<GroupTextMessage, 'id'>
type OmitIdNoteMessage = Omit<GroupNoteMessage, 'id'>
type OmitIdImageMessage = Omit<GroupImageMessage, 'id'>
type OmitIdMessage = OmitIdTextMessage | OmitIdNoteMessage | OmitIdImageMessage

export class MessageGroupRepository {

  public create(message: OmitIdMessage) {
    return firestore
      .collection(sentMessageCollectionPath({ groupId: message.groupId }))
      .doc()
      .set(mapEntityToDTO(message))
  }
}

function isText(message: OmitIdMessage): message is OmitIdTextMessage {
  return message.type == GroupMessageType.text
}

function isNote(message: OmitIdMessage): message is OmitIdNoteMessage {
  return message.type == GroupMessageType.note
}

type TextMessageDTO = Omit<OmitIdTextMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type NoteMessageDTO = Omit<OmitIdNoteMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type ImageMessageDTO = Omit<OmitIdImageMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type UnionDTO = TextMessageDTO | NoteMessageDTO | ImageMessageDTO

function mapEntityToDTO(message: OmitIdMessage): UnionDTO {
  if (isNote(message)) {
    return {
      groupId: message.groupId,
      noteId: message.noteId,
      sentFromAccountId: message.sentFromAccountId,
      type: message.type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  } else if (isText(message)) {
    return {
      groupId: message.groupId,
      sentFromAccountId: message.sentFromAccountId,
      type: message.type,
      text: message.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  } else {
    return {
      groupId: message.groupId,
      sentFromAccountId: message.sentFromAccountId,
      type: message.type,
      imageUrl: message.imageUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  }
}
