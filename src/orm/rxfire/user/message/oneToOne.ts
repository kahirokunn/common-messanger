import { BaseMessageObservable } from './base'
import { USER } from '../../../../firebase/collectionSchema';

export class MessageOneToOneObservable extends BaseMessageObservable {
  public messageCollectionName() {
    return USER.children.MESSAGE_ONE_TO_ONE.name
  }
}
