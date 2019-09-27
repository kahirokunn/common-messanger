import uuid from 'uuid/v4'
import * as ftest from '@firebase/testing'
import { roomFactory } from '../../helper/factory/room'
import { sendTextMessage, sendImageMessage } from '../../../src/command/message'
import { getMessagePath, getRoomPath } from '../../../src/firebase/collectionSchema'
import { installApp } from '../../../src/firebase'
import { setMockUserForTest } from '../../../src/firebase/user'
import { setup, teardown } from '../../helper/setup'

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
const permissionDeniedError = { code: 'permission-denied' }

beforeEach(async () => {
  db = await setup({
    auth: sentFrom,
    data: mockData,
  })
})

afterEach(async () => {
  await teardown()
})

describe('sendTextMessage', () => {
  test('success sendTextMessage', async () => {
    installApp(db)
    setMockUserForTest(sentFrom)
    const room = mockData[Object.keys(mockData)[0]]
    await sendTextMessage(room.id, { text: 'first test message' })
    await ftest.assertSucceeds(db.collection(getMessagePath(room.id)).get())
  })

  test('failed sendTextMessage to other room', async () => {
    installApp(db)
    setMockUserForTest(sentFrom)
    const room = mockData[Object.keys(mockData)[1]]
    await expect(sendTextMessage(room.id, { text: 'first test message' })).rejects.toMatchObject(permissionDeniedError)
  })
})

describe('sendImageMessage', () => {
  const imageUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png' as const
  test('success sendImageMessage', async () => {
    installApp(db)
    setMockUserForTest(sentFrom)
    const room = mockData[Object.keys(mockData)[0]]
    await sendImageMessage(room.id, { imageUrl })
    await ftest.assertSucceeds(db.collection(getMessagePath(room.id)).get())
  })

  test('failed sendImageMessage to other room', async () => {
    installApp(db)
    setMockUserForTest(sentFrom)
    const room = mockData[Object.keys(mockData)[1]]
    await expect(sendImageMessage(room.id, { imageUrl })).rejects.toMatchObject(permissionDeniedError)
  })
})
