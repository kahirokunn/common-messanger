import uuid from 'uuid/v4'
import { firestore } from 'firebase'
import { roomFactory } from '../helper/factory/room'
import { alreadyReadMessageFactory } from '../helper/factory/alreadyReadMessage'
import { getRoomPath, getAlreadyReadMessagePath } from '../../src/firebase/collectionSchema'
import { installApp, firestore as firestoreInstance } from '../../src/firebase'
import { setMockUserForTest } from '../../src/firebase/user'
import { setup, teardown } from '../helper/setup'
import { AlreadyReadMessageObserver } from '../../src/query/alreadyReadMessage'
import { Id } from '../../src/firebase/type'

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

function getAlreadyReadMessageMockData(roomId: Id) {
  const dataList = [
    alreadyReadMessageFactory({ roomId, readAccountId: sentFrom.uid }),
    alreadyReadMessageFactory({ roomId }),
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

describe('AlreadyReadMessageObserver', () => {
  test('success receive already read message', async (done) => {
    const room = mockData[Object.keys(mockData)[0]] as ReturnType<typeof roomFactory>
    const alreadyReadMessage = new AlreadyReadMessageObserver()

    alreadyReadMessage.alreadyReadMessages$.subscribe((data) => {
      expect(data.length).toEqual(1)
      done()
    })

    alreadyReadMessage.fetchAlreadyReadMessages(room.id)
  })

  test('failed update other person already read message', async () => {
    const alreadyReadMessage = mockData[Object.keys(mockData)[4]] as ReturnType<typeof alreadyReadMessageFactory>

    await expect(
      firestoreInstance
        .collection(getAlreadyReadMessagePath(alreadyReadMessage.readAccountId, alreadyReadMessage.roomId))
        .doc(alreadyReadMessage.readAccountId)
        .delete(),
    ).rejects.toMatchObject(permissionDeniedError)
  })
})
