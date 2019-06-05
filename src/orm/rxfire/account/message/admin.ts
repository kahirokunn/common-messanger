import { BaseMessageObservable } from './base'
import { ACCOUNT } from '../../../../firebase/collectionSchema';

export class MessageAdminObservable extends BaseMessageObservable {
  public messageCollectionName() {
    return ACCOUNT.children.MESSAGE_ADMIN.name
  }
}
