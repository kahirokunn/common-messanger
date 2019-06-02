import { Observable } from 'rxjs'

export interface PaginationObservableFactory<T> {
  factory(limit: number, startAfter?: Date): Observable<T>
}
