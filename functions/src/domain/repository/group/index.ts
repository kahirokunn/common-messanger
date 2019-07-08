import { firestore as firestoreFactory } from 'firebase-admin'
import { GROUP } from '../../../../../src/firebase/collectionSchema'
import { Group as GroupEntity } from '../../../../../src/entity/group'

export class GroupRepository {
  constructor(private firestore: ReturnType<typeof firestoreFactory>) { }

  public async get(groupId: string) {
    const snap = await this.firestore.collection(GROUP.name).doc(groupId).get()
    const group = { ...snap.data(), id: snap.id } as GroupEntity
    return group
  }
}
