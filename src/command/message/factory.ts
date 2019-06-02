import { Omit } from "../../submodule/type";
import { TextMessage, NoteMessage, ImageMessage, MessageType, Message } from '../../entity/message/index'
import { getOwnId } from "../../domain/auth";

type InputText = Omit<Omit<Omit<Omit<TextMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputNote = Omit<Omit<Omit<Omit<NoteMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputImage = Omit<Omit<Omit<Omit<ImageMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>

export function textMessageFactory(input: InputText): Omit<TextMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: MessageType.text,
  }
}

export function noteMessageFactory(input: InputNote): Omit<NoteMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: MessageType.note,
  }
}

export function imageMessageFactory(input: InputImage): Omit<ImageMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: MessageType.image,
  }
}
