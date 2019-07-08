import camelToSnake from 'snakecase-keys'
import { client } from '../../../submodules/graphqlClient';
import { MESSAGE_TYPE } from '../../../../../src/entity/message';

type ID = string

type Varivables = {
  sentToUid: ID,
  messageId: ID,
  messageType: MESSAGE_TYPE
  messageText?: string
  imageUrl?: string
}

const query = `
  mutation (
    $sent_to_uid: !ID
    $message_id: !ID
    $message_type: !MessageType
    $message_text: String
    $image_url: String
  ) {
    PushNotificationByAdmin (
      sent_to_uid: $sent_to_uid
      message_id: $message_id
      message_type: $message_type
      message_text: $message_text
      image_url: $image_url
    )
  }
`

export async function pushNotificationByAdmin(variables: Varivables): Promise<void> {
  await client.request(query, camelToSnake(variables, { deep: true }))
}
