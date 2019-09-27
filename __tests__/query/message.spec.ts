import uuid from 'uuid/v4'
import { roomFactory } from '../helper/factory/room'
import { sendTextMessage } from '../../src/command/message'
import { getRoomPath } from '../../src/firebase/collectionSchema'
import { installApp } from '../../src/firebase'
import { setMockUserForTest } from '../../src/firebase/user'
import { setup, teardown } from '../helper/setup'
import { MessageObserver } from '../../src/query/message'

let db: firebase.firestore.Firestore
const sentFrom = { uid: uuid() }
const sentTo = { uid: uuid() }

function getRoomMockData() {
  const room1 = roomFactory({ memberIds: [sentFrom.uid, sentTo.uid] })
  const room2 = roomFactory({ memberIds: [uuid(), sentTo.uid] })
  return {
    [`${getRoomPath()}/${room1.id}`]: room1,
    [`${getRoomPath()}/${room2.id}`]: room2,
  }
}

const mockData = getRoomMockData()
const permissionDeniedError = { code: 'permission-denied' } as const

setMockUserForTest(sentFrom)

beforeEach(async () => {
  db = await setup({
    auth: sentFrom,
    data: mockData,
  })
  installApp(db)
})

afterEach(async () => {
  await teardown()
})

describe('MessageObserver', () => {
  const input = { text: 'test message' } as const

  test('success receive message', async (done) => {
    const room = mockData[Object.keys(mockData)[0]]
    const message = new MessageObserver()
    message.messages$.subscribe((data) => {
      expect(data.roomId).toEqual(room.id)
      expect(data.messages.length).toEqual(1)
      done()
    })
    message.fetchMessage(room.id, 10)
    await sendTextMessage(room.id, input)
  })

  test('failed receive other room message', async (done) => {
    const message = new MessageObserver()
    message.messages$.subscribe({
      error: (error) => {
        expect(error).toMatchObject(permissionDeniedError)
        done()
      },
    })
    message.fetchMessage(uuid(), 10)
  })
})
