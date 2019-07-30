import 'firebase/auth'
import 'firebase/firestore'
import * as firebase from 'firebase/app'
import config from './config.json'
import { installApp } from 'common-messanger'
import Demo from './components/demo'

const app = firebase.initializeApp(config)
const firestore = firebase.firestore(app)
installApp(firestore)

firebase.auth().signInAnonymously().catch((error) => console.error(error));

export default Demo
