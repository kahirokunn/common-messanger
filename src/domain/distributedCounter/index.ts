import { sha256 } from 'js-sha256'

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}

// nodeSize以下の整数でできた乱数を取得し、それをsha256でハッシュ化し、hexエンコード
export function getRandomNodeId(nodeSize: number) {
  return sha256(`${getRandomInt(nodeSize)}`)
}
