import * as firebase from 'firebase/app'
import { TextMessage, NoteMessage, ImageMessage, MESSAGE_TYPE } from './message'
import { Id } from '../../firebase/type'

type InputText = Omit<Omit<Omit<Omit<TextMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputNote = Omit<Omit<Omit<Omit<NoteMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputImage = Omit<Omit<Omit<Omit<ImageMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>

function setSharedProperty<T>(input: T): T & { createdAt: Date; sentFromAccountId: Id } {
  const { currentUser } = firebase.auth()
  if (currentUser) {
    return {
      ...input,
      createdAt: new Date(),
      sentFromAccountId: currentUser.uid,
    }
  }
  throw Error('failed to get current user from firebase auth sdk')
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
