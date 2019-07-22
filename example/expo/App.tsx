import 'firebase/auth'
import 'firebase/firestore'
import firebase from 'firebase/app'
import config from './config.json'
import { installApp } from './src'
import Admin from './components/oneToOne'

const app = firebase.initializeApp(config)
const firestore = firebase.firestore(app)
installApp(firestore)

firebase.auth().signInAnonymously().catch((error) => console.error(error));

export default Admin
