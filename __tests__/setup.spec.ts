import { setup, teardown } from './helper/setup'

const mockUser = {
  uid: 'jeffd23',
} as const

const mockData = {
  'users/jeffd23': {
    foo: 'bar',
  },
  'tasks/testTask': {
    hello: 'world',
  },
} as const

const testFunc = async () => {
  const db = await setup({
    auth: mockUser,
    data: mockData,
    useRule: false,
  })

  await Promise.all([
    Object.keys(mockData).map(async (path) => {
      const docSnap = await db.doc(path).get()
      expect(docSnap.data() as any).toBe(mockData[path as keyof typeof mockData])
    }),
  ])

  await teardown()
}

describe('setup test', () => {
  test('success setup1', testFunc)
  test('success setup2', testFunc)
})
