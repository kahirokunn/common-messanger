import { BaseMessageRepository } from "../base";
import { USER } from "../../../firebase/collectionSchema";

export class MessageGroupRepository extends BaseMessageRepository {
  public messageCollectionName() {
    return USER.children.MESSAGE_GROUP.name
  }
}
