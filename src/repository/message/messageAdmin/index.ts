import { BaseMessageRepository } from "../base";
import { USER } from "../../../firebase/collectionSchema";

export class MessageAdminRepository extends BaseMessageRepository {
  public messageCollectionName() {
    return USER.children.MESSAGE_ADMIN.name
  }
}
