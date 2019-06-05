import { firebase, firestore } from "../../firebase";
import { TextMessage, NoteMessage, ImageMessage, MessageType } from "../../entity/message";
import { Omit } from "../../submodule/type";
import { ACCOUNT } from "../../firebase/collectionSchema";

type OmitIdTextMessage = Omit<TextMessage, 'id'>
type OmitIdNoteMessage = Omit<NoteMessage, 'id'>
type OmitIdImageMessage = Omit<ImageMessage, 'id'>
type OmitIdMessage = OmitIdTextMessage | OmitIdNoteMessage | OmitIdImageMessage

export abstract class BaseMessageRepository {
  abstract messageCollectionName(): string

  public create(message: OmitIdMessage) {
    const collectionPath = `${ACCOUNT.name}/${message.sentFromAccountId}/${this.messageCollectionName()}`
    return firestore.collection(collectionPath).doc().set(mapEntityToDTO(message))
  }
}

function isText(message: OmitIdMessage): message is OmitIdTextMessage {
  return message.type == MessageType.text
}

function isNote(message: OmitIdMessage): message is OmitIdNoteMessage {
  return message.type == MessageType.note
}

type TextMessageDTO = Omit<OmitIdTextMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type NoteMessageDTO = Omit<OmitIdNoteMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type ImageMessageDTO = Omit<OmitIdImageMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type UnionDTO = TextMessageDTO | NoteMessageDTO | ImageMessageDTO

function mapEntityToDTO(message: OmitIdMessage): UnionDTO {
  if (isNote(message)) {
    return {
      noteId: message.noteId,
      sentFromAccountId: message.sentFromAccountId,
      sentToAccountId: message.sentToAccountId,
      type: message.type,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  } else if (isText(message)) {
    return {
      sentFromAccountId: message.sentFromAccountId,
      sentToAccountId: message.sentToAccountId,
      type: message.type,
      text: message.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  } else {
    return {
      sentFromAccountId: message.sentFromAccountId,
      sentToAccountId: message.sentToAccountId,
      type: message.type,
      imageUrl: message.imageUrl,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  }
}
