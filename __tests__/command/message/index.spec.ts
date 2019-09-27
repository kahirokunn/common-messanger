import uuid from 'uuid/v4'
import * as ftest from '@firebase/testing'
import { roomFactory } from '../../helper/factory/room'
import { sendTextMessage } from '../../../src/command/message'
import { getMessagePath, getRoomPath } from '../../../src/firebase/collectionSchema'
import { installApp } from '../../../src/firebase'
import { setMockUserForTest } from '../../../src/firebase/user'
import { setup, teardown } from '../../helper/setup'

const testName = 'unit-test-message-commands'
let db: firebase.firestore.Firestore
const sentFrom = { uid: uuid() }
const sentTo = { uid: uuid() }

function getRoomMockData() {
  const room = roomFactory({ memberIds: [sentFrom.uid, sentTo.uid] })
  return {
    [`${getRoomPath()}/${room.id}`]: room,
  }
}

const mockData = getRoomMockData()

describe(testName, () => {
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
  })
})
