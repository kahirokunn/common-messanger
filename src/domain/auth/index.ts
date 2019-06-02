import { auth } from '../../firebase/index'
import { isDebug } from '../../debug';

export function getOwnId(): string {
  if (isDebug()) {
    return "1"
  }
  const { currentUser } = auth()
  if (currentUser) {
    return currentUser.uid
  }
  throw Error("未ログイン状態で getOwnId を実行したのでエラーを投げました")
}
