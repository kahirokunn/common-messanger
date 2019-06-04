import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
admin.initializeApp(functions.config().firebase)

export * from './functions/copySentOneToOneMessageToTargets'
export * from './functions/copySentAdminMessageToTargets'
