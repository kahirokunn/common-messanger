import React from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { Subscription } from 'rxjs'
import {
  MessageObserver,
  isTextMessage,
  isNoteMessage,
  sendTextMessage,
  Message,
  UnreadMessageObserver,
  RoomObserver,
  TimelineObserver,
  readMessage
} from 'common-messanger'
import { filter, map } from 'rxjs/operators'
import * as firebase from 'firebase/app'

const roomId = '1'

type Props = {}
type State = {
  messages: Message[]
  subscription: Subscription | null
  beginAt: Date
}
const messageObserver = new MessageObserver()

function renderMessage(message: Message) {
  if (isTextMessage(message)) {
    return (
      <Text style={{
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
      }}>{`text: ${message.text}`}</Text>)
  } else if (isNoteMessage(message)) {
    return (
      <Text style={{
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
      }}>{`noteId: ${message.noteId}`}</Text>)
  } else {
    return (
      <Text style={{
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
      }}>{`imageUrl: ${message.imageUrl}`}</Text>)
  }
}

function onPress() {
  sendTextMessage(roomId, {
    text: `Hello world! ${Math.random() * 100}`
  })
}

export default class OneToOne extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      messages: [],
      subscription: null,
      beginAt: new Date()
    }
  }

  componentDidMount() {
    const subscription = messageObserver
      .messages$
      .pipe(filter(data => data.roomId === roomId))
      .pipe(map(data => data.messages))
      .subscribe(messages => this.setState({ messages }))
    this.setState({ subscription })
    messageObserver.fetchMessage(roomId, 10)

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const unreadMessageObserver = new UnreadMessageObserver()
        unreadMessageObserver
          .unreadMessages$
          .subscribe((unreadMessages) => console.log('unreadMessages', Object.keys(unreadMessages.unreadMessages).length))

        unreadMessageObserver.fetchUnreadMessages(roomId)

        const timelineObserver = new TimelineObserver(new RoomObserver(), new UnreadMessageObserver(), new MessageObserver())
        timelineObserver.fetchRooms(10)
      }
    })
  }

  readMessage() {
    readMessage(roomId, this.state.beginAt, new Date())
  }

  componentWillUnmount() {
    if (this.state.subscription) {
      this.state.subscription.unsubscribe()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button
          color="black"
          title={"add new Article"}
          onPress={() => onPress()}
        />
        <Button
          color="black"
          title={"read message"}
          onPress={() => this.readMessage()}
        />
        <View style={{ height: 300 }} >
          <ScrollView>
            {this.state.messages.map(message => (
              <View key={message.id} style={{
                backgroundColor: 'pink',
                height: 45,
                justifyContent: 'center',
                paddingLeft: 20,
              }}>{renderMessage(message)}</View>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
