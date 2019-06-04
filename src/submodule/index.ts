import { Omit } from './type'

export function omit<T, K extends keyof T>(object: T, key: K): Omit<T, K> {
  const newObj = { ...object }
  delete newObj[key]
  return newObj
}
