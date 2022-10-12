import React from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
// View and Platform determine the OS currently in use

// import firebase to store chat data
const firebase = require('firebase');
require('firebase/firestore');

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
    };
    // Connect to Firebase account
    const firebaseConfig = {
      apiKey: "AIzaSyA1kIStYbEnlxAxetvMHgWRvhqroHSsANI",
      authDomain: "chat-app-a6f12.firebaseapp.com",
      projectId: "chat-app-a6f12",
      storageBucket: "chat-app-a6f12.appspot.com",
      messagingSenderId: "905754841965",
      appId: "1:905754841965:web:00724ef08506bf26c38064",
      measurementId: "G-55YLJ3W4V6"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    };
    // Reference to 'messages' collection in Firebase
    this.referenceChatMessages = firebase.firestore().collection('messages');
  };

  componentDidMount() {
    // Displaying name in the title of the screen dynamically based on user input in the start component
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    // Authenticate users anonymously
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        messages: [],
        uid: user.uid,
        user: {
          _id: user.uid,
          name: name,
        }
      });
      // Reference to load messages from Firebase
      this.referenceChatMessages = firebase.firestore().collection('messages');
      // stop listening for changes
      this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  };

  // function retrieving current messages data and storing it in state 
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  // function being called when a user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => { this.addMessages(this.state.messages[0]) }
    )
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
  };

  render() {
    // Changing bg-colour based on user input in the start component
    const { color, name } = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: name,
          }}
        />
        {/* Fix keyboard hides the message input field for older Android mobile models */}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    )
  };

};

// ------------- Styling ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text: {
    color: '#fff',
  },
});

// for reference of GiftedChat data structure
    // messages: [
    //   {
    //     _id: 1,
    //     text: 'Hello developer',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any',
    //     }
    //   },
    //   {
    //     _id: 2,
    //     text: `${name} has joined the chat`,
    //     createdAt: new Date(),
    //     system: true,
    //   },
    // ]