import { BaseMessageObservable } from './base'
import { USER } from '../../../../firebase/collectionSchema';

export class MessageGroupObservable extends BaseMessageObservable {
  public messageCollectionName() {
    return USER.children.MESSAGE_GROUP.name
  }
}
