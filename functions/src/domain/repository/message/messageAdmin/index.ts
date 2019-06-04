import { BaseSentMessageRepository } from "../base";
import { USER } from '../../../../../../src/firebase/collectionSchema';

export class SentMessageOneToOneRepository extends BaseSentMessageRepository {
  public messageCollectionName() {
    return USER.children.MESSAGE_ADMIN.name
  }
}
