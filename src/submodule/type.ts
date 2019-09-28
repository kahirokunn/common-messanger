import { Observable } from 'rxjs'

export type OrOmit<T, K extends keyof T> = T | Omit<T, K>
export type Pick1th<T> = T extends (first: infer U, ...other: unknown[]) => unknown ? U : never
export type Pick2th<T> = T extends (first: unknown, second: infer U, ...other: unknown[]) => unknown ? U : never

export type PickItemTypeFromObservable<T extends Observable<unknown>> = Pick1th<Pick1th<T['subscribe']>>
