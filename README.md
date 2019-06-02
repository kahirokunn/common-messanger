# common-messanger

## Install App

```
$ yarn add common-messanger
```

```typescript
import firebase from 'firebase/app'
import { installApp } from 'common-messanger'
import 'firebase/auth'
import 'firebase/firestore'

const app = firebase.initializeApp({
  "apiKey": "AIzaSyAkpRvY9dp9Io5jE-rizLd08tsAxEOL1zE",
  "authDomain": "expo-ballcap.firebaseapp.com",
  "databaseURL": "https://expo-ballcap.firebaseio.com",
  "projectId": "expo-ballcap",
  "storageBucket": "expo-ballcap.appspot.com",
  "messagingSenderId": "207652457989",
  "appId": "1:207652457989:web:a1472f79b97e7a0a"
})
const firestore = firebase.firestore(app)
installApp(firestore)
```
