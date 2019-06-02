import { BaseMessageObserver } from '../base';
import { MessageGroupObservable } from '../../../orm/rxfire/user/message';

export class GroupMessageObserver extends BaseMessageObserver {
  observableFactory = new MessageGroupObservable()
}
