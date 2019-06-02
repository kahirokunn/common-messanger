import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const app = firebase.initializeApp({})
const firestore = firebase.firestore(app)

const { auth } = firebase

export { firebase, firestore, auth }
