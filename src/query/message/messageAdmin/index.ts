import { BaseMessageObserver } from '../base';
import { MessageAdminObservable } from '../../../orm/rxfire/user/message';

export class AdminMessageObserver extends BaseMessageObserver {
  observableFactory = new MessageAdminObservable()
}
