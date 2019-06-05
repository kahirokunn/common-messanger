import { BaseMessageObservable } from './base'
import { ACCOUNT } from '../../../../firebase/collectionSchema';

export class MessageOneToOneObservable extends BaseMessageObservable {
  public messageCollectionName() {
    return ACCOUNT.children.MESSAGE_ONE_TO_ONE.name
  }
}
