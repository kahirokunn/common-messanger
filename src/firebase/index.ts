import firebase from 'firebase/app'

let firestore: firebase.firestore.Firestore
export function installApp(firestore: firebase.firestore.Firestore) {
  firestore = firestore
}

const { auth } = firebase

export { firebase, firestore, auth }
