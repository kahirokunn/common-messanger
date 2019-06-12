import { auth } from "../../firebase/index";
import { isDebug } from "../../debug";

let currentUserUid = "3";
export function getOwnId(): string {
  if (isDebug()) {
    return currentUserUid;
  }
  const { currentUser } = auth();
  if (currentUser) {
    return currentUser.uid;
  }
  throw Error("未ログイン状態で getOwnId を実行したのでエラーを投げました");
}

export function setOwnId(uid: string) {
  currentUserUid = uid;
}
