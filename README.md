# common-messanger

## Install App

```sh
$ yarn add common-messanger
```

```typescript
import * as firebase from 'firebase/app'
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

## Test

```sh
$ yarn test
```

## Don't forget call dispose

```typescript
import {
  MessageObserver,
} from 'common-messanger'

// initialized
const messageObserver = new MessageObserver()

// just call once
messageObserver.messages$
  .pipe(map((data) => data.messages))
  .subscribe((messages) => this.setState({ messages }))

// when you want to fetch all messages
messageObserver.fetchMessage(roomId)

// when component will unmount
messageObserver.dispose()
```
