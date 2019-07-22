import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { Subscription } from 'rxjs'
import {
  MessageObserver
} from '../src/query/message'
import { PickItemTypeFromObservable } from '../src/submodule/type';
import { isTextMessage, isNoteMessage } from '../src/domain/message'
import { sendTextMessage } from '../src/command/message'

const roomId = '1'

type Message = PickItemTypeFromObservable<MessageObserver['messages$']>[number]
type Props = {};
type State = {
  messages: Message[]
  subscription: Subscription | null
};
const messageObserver = new MessageObserver(roomId);

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
    super(props);
    this.state = {
      messages: [],
      subscription: null,
    }
  }

  componentDidMount() {
    const subscription = messageObserver
      .messages$
      .subscribe(messages => this.setState({ messages }))
    this.setState({ subscription })
    messageObserver.fetchMessage(10)
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
          title={"add new Article"}
          onPress={() => onPress()}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
