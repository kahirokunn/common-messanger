import * as firebase from 'firebase/app'

// eslint-disable-next-line import/no-mutable-exports
let firestore: firebase.firestore.Firestore
export function installApp(instance: firebase.firestore.Firestore) {
  firestore = instance
}

export { firebase, firestore }
