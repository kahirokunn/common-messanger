import * as firebase from 'firebase/app'

let firestore: firebase.firestore.Firestore
export function installApp(instance: firebase.firestore.Firestore) {
  firestore = instance
}

export { firebase, firestore }
