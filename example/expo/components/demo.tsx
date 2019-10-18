/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import React from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { filter, map } from 'rxjs/operators'
import * as firebase from 'firebase/app'
import {
  MessageObserver,
  isTextMessage,
  isNoteMessage,
  sendTextMessage,
  Message,
  UnreadMessageObserver,
  RoomObserver,
  TimelineObserver,
  readMessage,
  AlreadyReadMessageObserver,
} from 'common-messanger'

const roomId = '1'

type Props = {}
type State = {
  messages: Message[]
  beginAt: Date
  messageObserver: MessageObserver
  timelineObserver: TimelineObserver
  unreadMessageObserver: UnreadMessageObserver
  alreadyReadMessageObserver: AlreadyReadMessageObserver
}

function renderMessage(message: Message) {
  if (isTextMessage(message)) {
    return (
      <Text
        style={{
          fontSize: 20,
          color: 'black',
          fontWeight: 'bold',
        }}
      >{`text: ${message.text}`}</Text>
    )
  }
  if (isNoteMessage(message)) {
    return (
      <Text
        style={{
          fontSize: 20,
          color: 'black',
          fontWeight: 'bold',
        }}
      >{`noteId: ${message.noteId}`}</Text>
    )
  }
  return (
    <Text
      style={{
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
      }}
    >{`imageUrl: ${message.imageUrl}`}</Text>
  )
}

function onPress() {
  sendTextMessage(roomId, {
    text: `Hello world! ${Math.random() * 100}`,
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class Demo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      messages: [],
      beginAt: new Date(),
      messageObserver: new MessageObserver(),
      unreadMessageObserver: new UnreadMessageObserver(),
      timelineObserver: new TimelineObserver(new RoomObserver(), new UnreadMessageObserver(), new MessageObserver()),
      alreadyReadMessageObserver: new AlreadyReadMessageObserver(),
    }
  }

  componentDidMount() {
    this.state.messageObserver.messages$
      .pipe(filter((data) => data.roomId === roomId))
      .pipe(map((data) => data.messages))
      .subscribe((messages) => this.setState({ messages }))

    this.state.alreadyReadMessageObserver.alreadyReadMessages$.subscribe((v) => console.log(v))

    this.state.unreadMessageObserver.unreadMessages$.subscribe((unreadMessages) =>
      console.log('unreadMessages', Object.keys(unreadMessages.unreadMessages).length),
    )

    this.state.timelineObserver.rooms$.subscribe((data) => console.log(data))

    firebase.auth().onAuthStateChanged((user) => {
      if (!user) return

      this.state.messageObserver.fetchMessage(roomId)
      this.state.unreadMessageObserver.fetchUnreadMessages(roomId)
      this.state.timelineObserver.fetchRooms(10)
    })
  }

  componentWillUnmount() {
    this.state.messageObserver.dispose()
  }

  async readMessage() {
    await readMessage(roomId, this.state.beginAt, new Date())
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button color="black" title="add new Article" onPress={() => onPress()} />
        <Button color="black" title="read message" onPress={() => this.readMessage()} />
        <View style={{ height: 300 }}>
          <ScrollView>
            {this.state.messages.map((message) => (
              <View
                key={message.id}
                style={{
                  backgroundColor: 'pink',
                  height: 45,
                  justifyContent: 'center',
                  paddingLeft: 20,
                }}
              >
                {renderMessage(message)}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }
}
