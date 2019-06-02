import { Observable } from 'rxjs'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type OrOmit<T, K extends keyof T> = T | Omit<T, K>
export type Pick1th<T> = T extends (first: infer U, ...other: any[]) => any ? U : never
export type Pick2th<T> = T extends (first: any, second: infer U, ...other: any[]) => any ? U : never

export type PickItemTypeFromObservable<T extends Observable<any>> = Pick1th<Pick1th<T['subscribe']>>
