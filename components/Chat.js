import React from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

// import firebase to store chat data
const firebase = require('firebase');
require('firebase/firestore');

import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
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


  // function adding new messages to 'messages' collection in Firebase
  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  // function to load messages from asyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
    // for testing
    // console.log(this.state.messages)
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // function in your code to delete the messages during development
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    // Displaying name in the title of the screen dynamically based on user input in the start component
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // First load messages from asyncStorage
    this.getMessages();

    // Then check if online to sync with firestore and save any updated messages
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
        // for testing
        // console.log('online');

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
      } else {
        this.setState({
          isConnected: false,
        });
        // for testing
        // console.log('offline');

        // Add offline message
        this.props.navigation.setOptions({ title: `${name} (You're offline)` });
      }
    });

  };

  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
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

  // function being called when a user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      // this.addMessages(this.state.messages[0]);
      this.addMessages();
    });
  };


  // function to display custom speech bubble colour
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

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  render() {
    // Changing bg-colour based on user input in the start component
    const { color, name } = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
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