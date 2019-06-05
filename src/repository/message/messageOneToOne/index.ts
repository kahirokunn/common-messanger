import { BaseMessageRepository } from "../base";
import { ACCOUNT } from "../../../firebase/collectionSchema";

export class MessageOneToOneRepository extends BaseMessageRepository {
  public messageCollectionName() {
    return ACCOUNT.children.SENT_MESSAGE_ONE_TO_ONE.name
  }
}
