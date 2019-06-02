import { Pick1th } from '../../../submodule/type';
import { textMessageFactory, imageMessageFactory, noteMessageFactory } from '../../../domain/message/factory';
import { MessageOneToOneRepository } from '../../../repository/message/messageOneToOne';

export async function sendImageMessage(input: Pick1th<typeof imageMessageFactory>) {
  const repository = new MessageOneToOneRepository()
  await repository.create(imageMessageFactory(input))
}

export async function sendNoteMessage(input: Pick1th<typeof noteMessageFactory>) {
  const repository = new MessageOneToOneRepository()
  await repository.create(noteMessageFactory(input))
}

export async function sendTextMessage(input: Pick1th<typeof textMessageFactory>) {
  const repository = new MessageOneToOneRepository()
  await repository.create(textMessageFactory(input))
}
