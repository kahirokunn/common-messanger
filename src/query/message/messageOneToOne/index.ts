import { BaseMessageObserver } from '../base';
import { MessageOneToOneObservable } from '../../../orm/rxfire/user/message';

export class OneToOneMessageObserver extends BaseMessageObserver {
  observableFactory = new MessageOneToOneObservable()
}
