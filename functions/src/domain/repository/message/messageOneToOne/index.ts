import { BaseReceiveMessageRepository } from "../base";
import { USER } from '../../../../../../src/firebase/collectionSchema';

export class ReceiveMessageOneToOneRepository extends BaseReceiveMessageRepository {
  public messageCollectionName() {
    return USER.children.MESSAGE_ONE_TO_ONE.name
  }
}
