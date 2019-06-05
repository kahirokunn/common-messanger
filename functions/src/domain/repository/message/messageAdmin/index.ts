import { BaseSentMessageRepository } from "../base";
import { ACCOUNT } from '../../../../../../src/firebase/collectionSchema';

export class SentMessageAdminRepository extends BaseSentMessageRepository {
  public messageCollectionName() {
    return ACCOUNT.children.MESSAGE_ADMIN.name
  }
}
