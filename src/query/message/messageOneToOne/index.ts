import { BaseMessageObserver } from '../base';
import { MessageOneToOneObservable } from '../../../orm/rxfire/account/message';

export class OneToOneMessageObserver extends BaseMessageObserver {
  observableFactory = new MessageOneToOneObservable()
}
