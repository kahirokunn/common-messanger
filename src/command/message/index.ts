import { firebase, firestore } from '../../firebase'
import { TextMessage, NoteMessage, ImageMessage, MESSAGE_TYPE } from '../../domain/message/message'
import { Pick1th } from '../../submodule/type'
import { getMessagePath } from '../../firebase/collectionSchema'
import { Id } from '../../firebase/type'
import { noteMessageFactory, imageMessageFactory, textMessageFactory } from '../../domain/message/factory'

type OmitIdTextMessage = Omit<TextMessage, 'id'>
type OmitIdNoteMessage = Omit<NoteMessage, 'id'>
type OmitIdImageMessage = Omit<ImageMessage, 'id'>
type OmitIdMessage = OmitIdTextMessage | OmitIdNoteMessage | OmitIdImageMessage

function isText(message: OmitIdMessage): message is OmitIdTextMessage {
  return message.type === MESSAGE_TYPE.TEXT
}

function isNote(message: OmitIdMessage): message is OmitIdNoteMessage {
  return message.type === MESSAGE_TYPE.NOTE
}

function mapEntityToDTO(message: OmitIdMessage): UnionDTO {
  if (isNote(message)) {
    return {
      noteId: message.noteId,
      sentFromAccountId: message.sentFromAccountId,
      type: message.type,
      text: message.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  }
  if (isText(message)) {
    return {
      sentFromAccountId: message.sentFromAccountId,
      type: message.type,
      text: message.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }
  }
  return {
    sentFromAccountId: message.sentFromAccountId,
    type: message.type,
    imageUrl: message.imageUrl,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  }
}

function sendMessage(roomId: Id, message: OmitIdMessage) {
  return firestore.collection(getMessagePath(roomId)).add(mapEntityToDTO(message))
}

type TextMessageDTO = Omit<OmitIdTextMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type NoteMessageDTO = Omit<OmitIdNoteMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type ImageMessageDTO = Omit<OmitIdImageMessage, 'createdAt'> & { createdAt: firebase.firestore.FieldValue }
type UnionDTO = TextMessageDTO | NoteMessageDTO | ImageMessageDTO

export async function sendImageMessage(roomId: Id, input: Pick1th<typeof imageMessageFactory>): Promise<void> {
  await sendMessage(roomId, imageMessageFactory(input))
}

export async function sendNoteMessage(roomId: Id, input: Pick1th<typeof noteMessageFactory>): Promise<void> {
  await sendMessage(roomId, noteMessageFactory(input))
}

export async function sendTextMessage(roomId: Id, input: Pick1th<typeof textMessageFactory>): Promise<void> {
  await sendMessage(roomId, textMessageFactory(input))
}
