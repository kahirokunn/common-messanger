import { Observable, Subject, merge } from 'rxjs'
import { takeUntil, finalize, tap } from 'rxjs/operators'
import { Message, TextMessage, ImageMessage, NoteMessage } from '../domain/message/message'
import { Id } from '../firebase/type'
import { MessageObserver } from './message'
import { AlreadyReadMessageObserver } from './alreadyReadMessage'
import { AlreadyReadMessage } from '../domain/account/alreadyReadMessage'
import { getAccountId } from '../firebase/user'

type MergeReadCount<T> = T & { readCount: number }
type RoomMessagesData = (MergeReadCount<TextMessage> | MergeReadCount<ImageMessage> | MergeReadCount<NoteMessage>)[]

function mapToRoomMessagesData(messages: Message[], alreadyReadMessages: AlreadyReadMessage[]): RoomMessagesData {
  const accountId = getAccountId()
  const readCounts: { createdAt: Date; readCount: number }[] = messages.map((msg) => ({
    createdAt: msg.createdAt,
    readCount: 0,
  }))
  alreadyReadMessages.forEach((alreadyReadMessage) => {
    if (alreadyReadMessage.readAccountId === accountId) {
      return
    }
    messages.forEach((msg, index) => {
      if (alreadyReadMessage.updatedAt >= msg.createdAt) {
        readCounts[index].readCount += 1
      }
    })
  })
  return messages.map((msg, index) => ({
    ...msg,
    readCount: readCounts[index].readCount,
  }))
}

export class RoomMessageObserver {
  private readonly _roomMessages$: Subject<RoomMessagesData> = new Subject()

  private readonly _close$: Subject<never> = new Subject()

  constructor(private readonly messageObserver: MessageObserver, private readonly alreadyReadMessageObserver: AlreadyReadMessageObserver) {
    let messages: Message[] = []
    let alreadyReadMessages: AlreadyReadMessage[] = []
    merge(
      this.messageObserver.messages$.pipe(takeUntil(this._close$)).pipe(
        tap((data) => {
          messages = [...data.messages]
        }),
      ),
      this.alreadyReadMessageObserver.alreadyReadMessages$.pipe(takeUntil(this._close$)).pipe(
        tap((data) => {
          alreadyReadMessages = data
        }),
      ),
    )
      .pipe(takeUntil(this._close$))
      .subscribe({
        next: () => {
          this._roomMessages$.next(mapToRoomMessagesData(messages, alreadyReadMessages))
        },
        error: (error) => {
          this._roomMessages$.error(error)
        },
      })
  }

  get roomMessages$(): Observable<RoomMessagesData> {
    return this._roomMessages$.pipe(finalize(() => this._close$.next()))
  }

  public fetchRoomMessage(roomId: Id, limit?: number, startAfter?: Date) {
    this.messageObserver.fetchMessage(roomId, limit, startAfter)
    this.alreadyReadMessageObserver.fetchAlreadyReadMessages(roomId)
  }

  public dispose() {
    this._close$.next()
  }
}
