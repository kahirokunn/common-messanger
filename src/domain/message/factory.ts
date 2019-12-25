import { TextMessage, NoteMessage, ImageMessage, MediaMessage, MESSAGE_TYPE } from './message'
import { Id } from '../../firebase/type'
import { getAccountId } from '../../firebase/user'

type InputText = Omit<Omit<Omit<Omit<TextMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputNote = Omit<Omit<Omit<Omit<NoteMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputImage = Omit<Omit<Omit<Omit<ImageMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputMedia = Omit<Omit<Omit<Omit<MediaMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>

function setSharedProperty<T>(input: T): T & { createdAt: Date; sentFromAccountId: Id } {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getAccountId(),
  }
}

export function textMessageFactory(input: InputText): Omit<TextMessage, 'id'> {
  return {
    ...setSharedProperty(input),
    type: MESSAGE_TYPE.TEXT,
  }
}

export function noteMessageFactory(input: InputNote): Omit<NoteMessage, 'id'> {
  return {
    ...setSharedProperty(input),
    type: MESSAGE_TYPE.NOTE,
  }
}

export function imageMessageFactory(input: InputImage): Omit<ImageMessage, 'id'> {
  return {
    ...setSharedProperty(input),
    type: MESSAGE_TYPE.IMAGE,
  }
}

export function mediaMessageFactory(input: InputMedia): Omit<MediaMessage, 'id'> {
  return {
    ...setSharedProperty(input),
    type: MESSAGE_TYPE.MEDIA,
  }
}
