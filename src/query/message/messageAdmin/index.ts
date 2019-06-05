import { BaseMessageObserver } from '../base';
import { MessageAdminObservable } from '../../../orm/rxfire/account/message';

export class AdminMessageObserver extends BaseMessageObserver {
  observableFactory = new MessageAdminObservable()
}
