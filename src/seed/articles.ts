import { firestore } from '../firebase/index'

// 適当なサンプルデータを生成する
export function generateArticles(n: number) {
  for (let i = 0; i < n; i++) {
    firestore.collection("articles").add({
      title: `sample: ${i} ${Math.random()}`,
      body: `sample ${i} ${Math.random()}`
    })
  }
}
