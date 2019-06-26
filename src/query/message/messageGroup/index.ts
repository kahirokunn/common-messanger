import { Observable, Subject, Subscription } from 'rxjs'
import { GroupMessage } from '../../../entity/messageGroup'
import { MessageGroupObservable } from '../../../orm/rxfire/account/messageGroup'


export class GroupMessageObserver {
  private readonly _messages: Subject<GroupMessage[]> = new Subject<GroupMessage[]>()
  private _subscriptions: Subscription[] = []

  get messages$(): Observable<GroupMessage[]> {
    return this._messages
  }

  public fetchMessage(groupId: string, limit: number, startAfter?: Date) {
    const subscription = new MessageGroupObservable().factory(groupId, limit, startAfter)
      .subscribe(this._messages)
    this._subscriptions.push(subscription)
  }

  public depose() {
    this._subscriptions
      .map((subscription) => subscription.unsubscribe())
  }
}
