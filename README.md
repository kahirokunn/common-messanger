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
  "apiKey": apiKey,
  "authDomain": authDomain,
  "databaseURL": databaseURL,
  "projectId": projectId,
  "storageBucket": storageBucket,
  "messagingSenderId": messagingSenderId,
  "appId": appId
})
const firestore = firebase.firestore(app)
installApp(firestore)
```
