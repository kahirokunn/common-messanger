import uuid from 'uuid/v4'
import { roomFactory } from '../helper/factory/room'
import { alreadyReadMessageFactory } from '../helper/factory/alreadyReadMessage'
import { getRoomPath, getAlreadyReadMessagePath } from '../../src/firebase/collectionSchema'
import { installApp } from '../../src/firebase'
import { setMockUserForTest } from '../../src/firebase/user'
import { setup, teardown } from '../helper/setup'
import { AlreadyReadMessageObserver } from '../../src/query/alreadyReadMessage'
import { MessageObserver } from '../../src/query/message'
import { RoomMessageObserver } from '../../src/query/roomMessage'
import { Id } from '../../src/firebase/type'
import { sendTextMessage } from '../../src/command/message'
import { readMessage } from '../../src/command/readMessage'

let db: firebase.firestore.Firestore
const sentFrom = { uid: uuid() }
const sentTo = { uid: uuid() }

function getNextYear() {
  const dt = new Date()
  dt.setFullYear(dt.getFullYear() + 1)
  return dt
}

const nextYear = getNextYear()

function getRoomMockData() {
  const room1 = roomFactory({ memberIds: [sentFrom.uid, sentTo.uid] })
  const room2 = roomFactory({ memberIds: [uuid(), sentTo.uid] })
  return {
    [`${getRoomPath()}/${room1.id}`]: room1,
    [`${getRoomPath()}/${room2.id}`]: room2,
  }
}

function getAlreadyReadMessageMockData(roomId: Id) {
  const dataList = [
    alreadyReadMessageFactory({ roomId, readAccountId: sentFrom.uid }),
    // Bさんは来年の分まで自分のメッセージを読んでいるてい
    alreadyReadMessageFactory({ roomId, updatedAt: nextYear }),
    alreadyReadMessageFactory({}),
  ]
  return dataList.reduce(
    (sum, v) => ({
      ...sum,
      [`${getAlreadyReadMessagePath(v.readAccountId, v.roomId)}/${v.readAccountId}`]: v,
    }),
    {},
  )
}

const roomMockData = getRoomMockData()
const alreadyReadMessageMockData = getAlreadyReadMessageMockData(roomMockData[Object.keys(roomMockData)[0] as string].id)
const mockData: { [key: string]: any } = {
  ...roomMockData,
  ...alreadyReadMessageMockData,
}

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

describe('RoomMessageObserver', () => {
  const input = { text: 'test message' } as const

  test('success receive message', async (done) => {
    const room = mockData[Object.keys(mockData)[0]]
    const message = new RoomMessageObserver(new MessageObserver(), new AlreadyReadMessageObserver())
    message.roomMessages$.subscribe((data) => {
      expect(data.length).toEqual(1)
      expect(data[0].readCount).toEqual(0)
      done()
    })
    message.fetchRoomMessage(room.id)
    await sendTextMessage(room.id, input)
  })

  test('failed receive other room message', async (done) => {
    const message = new RoomMessageObserver(new MessageObserver(), new AlreadyReadMessageObserver())
    message.roomMessages$.subscribe({
      error: (error) => {
        expect(error).toMatchObject(permissionDeniedError)
        done()
      },
    })
    message.fetchRoomMessage(uuid(), 10)
  })

  test('success read message', async (done) => {
    const room = mockData[Object.keys(mockData)[0]]
    const message = new RoomMessageObserver(new MessageObserver(), new AlreadyReadMessageObserver())
    message.roomMessages$.subscribe((data) => {
      expect(data.length).toEqual(1)
      if (data[0].readCount === 1) {
        done()
      }
    })
    message.fetchRoomMessage(room.id)

    await Promise.all([sendTextMessage(room.id, input), readMessage(room.id, new Date(), new Date())])
  })
})
