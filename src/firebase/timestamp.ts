import * as firebase from 'firebase'

export function toDate(timestamp: firebase.firestore.Timestamp): Date {
  return timestamp ? timestamp.toDate() : new Date()
}
