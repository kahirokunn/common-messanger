import { BaseMessageRepository } from "../base";
import { USER } from "../../../firebase/collectionSchema";

export class MessageOneToOneRepository extends BaseMessageRepository {
  public messageCollectionName() {
    return USER.children.MESSAGE_ONE_TO_ONE.name
  }
}
