import { Omit } from "../../submodule/type";
import { TextMessage, NoteMessage, ImageMessage, MESSAGE_TYPE, Message } from '../../entity/message/index'
import { getOwnId } from "../auth";

type InputText = Omit<Omit<Omit<Omit<TextMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputNote = Omit<Omit<Omit<Omit<NoteMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputImage = Omit<Omit<Omit<Omit<ImageMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>

export function textMessageFactory(input: InputText): Omit<TextMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: MESSAGE_TYPE.TEXT,
  }
}

export function noteMessageFactory(input: InputNote): Omit<NoteMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: MESSAGE_TYPE.NOTE,
  }
}

export function imageMessageFactory(input: InputImage): Omit<ImageMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: MESSAGE_TYPE.IMAGE,
  }
}
