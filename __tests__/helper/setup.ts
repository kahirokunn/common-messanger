import * as firebase from '@firebase/testing'
import fs from 'fs'
import appRoot from 'app-root-path'

const mockRules = fs.readFileSync(appRoot.resolve('firestore.mock.rules'), 'utf8')
const prodRules = fs.readFileSync(appRoot.resolve('firestore.rules'), 'utf8')

export async function setup<T extends { [key: string]: object }>({
  auth,
  data,
  useRule,
}: {
  auth?: { [key in 'uid' | 'email']?: string }
  data?: T
  useRule?: boolean
}) {
  const projectId = `rules-spec-${Date.now()}`
  const app = firebase.initializeTestApp({
    projectId,
    auth,
  })

  const db = app.firestore()

  if (data) {
    await firebase.loadFirestoreRules({
      projectId,
      rules: mockRules,
    })

    await Promise.all(Object.keys(data).map((path) => db.doc(path).set(data[path])))
  }

  if (typeof useRule === 'undefined' || useRule) {
    await firebase.loadFirestoreRules({
      projectId,
      rules: prodRules,
    })
  }

  return db
}

export async function teardown() {
  Promise.all(firebase.apps().map((app) => app.delete()))
}
