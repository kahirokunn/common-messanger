import { BaseMessageRepository } from "../base";
import { ACCOUNT } from "../../../firebase/collectionSchema";

export class MessageAdminRepository extends BaseMessageRepository {
  public messageCollectionName() {
    return ACCOUNT.children.SENT_MESSAGE_ADMIN.name
  }
}
