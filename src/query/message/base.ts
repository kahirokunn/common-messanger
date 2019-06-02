import { Observable, Subject, Subscription } from 'rxjs'
import { Message } from '../../entity/message';
import { PaginationObservableFactory } from '../../orm/rxfire/observableFactory';


export abstract class BaseMessageObserver {
  abstract observableFactory: PaginationObservableFactory<Message[]>

  private readonly _messages: Subject<Message[]> = new Subject<Message[]>()
  private _subscriptions: Subscription[] = []

  get messages$(): Observable<Message[]> {
    return this._messages
  }

  public fetchMessage(limit: number, startAfter?: Date) {
    const subscription = this.observableFactory.factory(limit, startAfter)
      .subscribe(this._messages)
    this._subscriptions.push(subscription)
  }

  public depose() {
    this._subscriptions
      .map((subscription) => subscription.unsubscribe())
  }
}
