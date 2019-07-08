import { Omit } from "../../submodule/type";
import { GroupTextMessage, GroupNoteMessage, GroupImageMessage, GROUP_MESSAGE_TYPE } from '../../entity/messageGroup'
import { getOwnId } from "../auth";

type InputText = Omit<Omit<Omit<Omit<GroupTextMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputNote = Omit<Omit<Omit<Omit<GroupNoteMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>
type InputImage = Omit<Omit<Omit<Omit<GroupImageMessage, 'type'>, 'createdAt'>, 'sentFromAccountId'>, 'id'>

export function textMessageFactory(input: InputText): Omit<GroupTextMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: GROUP_MESSAGE_TYPE.TEXT,
  }
}

export function noteMessageFactory(input: InputNote): Omit<GroupNoteMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: GROUP_MESSAGE_TYPE.NOTE,
  }
}

export function imageMessageFactory(input: InputImage): Omit<GroupImageMessage, 'id'> {
  return {
    ...input,
    createdAt: new Date(),
    sentFromAccountId: getOwnId(),
    type: GROUP_MESSAGE_TYPE.IMAGE,
  }
}
