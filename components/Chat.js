import React from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
// View and Platform determine the OS currently in use

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    // Displaying name in the title of the screen dynamically based on user input in the start component
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // set static message including message data format
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          }
        },
        {
          _id: 2,
          text: `${name} has joined the chat`,
          createdAt: new Date(),
          system: true,
        },
      ]
    });
  };

  // function to dispay custom bubble colour
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#4A6C8B'
          }
        }}
      />
    )
  }

  // function being called when a user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    // Changing bg-colour based on user input in the start component
    const { color } = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* Fix keyboard hides the message input field for older Android mobile models */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text: {
    color: '#fff',
  },
});