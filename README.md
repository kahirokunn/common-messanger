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

## Setup cloud function

### 1. install dependencies

```
$ cd functions
$ yarn install
$ cd ..
```

### 2. setup process.env

#### by dot env

```sh
$ cp ./functions/.env.example ./functions/.env
$ vim ./functions/.env
```

#### by firebase

https://qiita.com/nerdyboy_cool/items/695c8af7ca8d22761927

## Deploy cloud function

```
$ cd functions
$ yarn install
$ cd ..
$ firebase deploy --only functions
```
