import {
  mergeDotEnvToNodeEnv,
  mergeFirebaseConfigToNodeEnv
} from './setupNodeEnv'

mergeDotEnvToNodeEnv()

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const config = functions.config()
admin.initializeApp(config.firebase)
mergeFirebaseConfigToNodeEnv(config)

export * from './functions/insertUnreadMessageToGroupMembers'
