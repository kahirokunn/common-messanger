import { Id } from "../../firebase/type"
import { Message } from "../message/message"

export type UnreadMessage = {
  id: Id
  mesasges: Message[] // json serializedされている
}
