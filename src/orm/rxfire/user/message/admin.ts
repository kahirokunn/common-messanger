import { BaseMessageObservable } from './base'
import { USER } from '../../../../firebase/collectionSchema';

export class MessageAdminObservable extends BaseMessageObservable {
  public messageCollectionName() {
    return USER.children.MESSAGE_ADMIN.name
  }
}
