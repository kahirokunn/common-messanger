import camelToSnake from 'snakecase-keys'
import { client } from '../../../submodules/graphqlClient';
import { MESSAGE_TYPE } from '../../../../../src/entity/message';

type ID = string

type Varivables = {
  sentFrom: ID,
  sentToUids: ID[],
  groupId: ID,
  messageId: ID,
  messageType: MESSAGE_TYPE
  messageText?: string
  imageUrl?: string
}

const query = `
  mutation (
    $sent_from: !ID
    $sent_to_uids: ![ID]
    $group_id: !ID
    $message_id: !ID
    $message_type: !MessageType
    $message_text: String
    $image_url: String
  ) {
    PushNotificationByGroup (
      sent_from: $sent_from
      sent_to_uids: $sent_to_uids
      group_id: $group_id
      message_id: $message_id
      message_type: $message_type
      message_text: $message_text
      image_url: $image_url
    )
  }
`

export async function pushNotificationByGroup(variables: Varivables): Promise<void> {
  await client.request(query, camelToSnake(variables, { deep: true }))
}
