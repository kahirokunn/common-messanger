import { firebase } from '.'

type PartialUser = Partial<{ uid: string; email: string }>
let mockUserForTest: PartialUser | null = null

export function setMockUserForTest(user: PartialUser) {
  mockUserForTest = user
}

export function getCurrentUserForTest() {
  return mockUserForTest
}

export function getAccountId() {
  const testUser = getCurrentUserForTest()
  if (testUser && testUser.uid) {
    return testUser.uid
  }

  const { currentUser } = firebase.auth()
  if (!currentUser) {
    throw Error('failed to get current user from firebase auth sdk')
  }
  return currentUser.uid
}
