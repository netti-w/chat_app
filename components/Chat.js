import React from 'react';
import { StyleSheet, View, Text, Button, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import * as Location from 'expo-location';
import MapView from 'react-native-maps';

import CustomActions from './CustomActions';

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
      image: null,
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

  // function to get uid from asyncStorage
  async getUser() {
    let user = '';
    try {
      user = await AsyncStorage.getItem('uid') || [];
      this.setState({
        uid: user
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // function to save uid in asyncStorage
  async saveUser() {
    let uid = this.state.uid;

    try {
      await AsyncStorage.setItem('uid', uid);
    } catch (error) {
      console.log(error.message);
    }
  }

  // function to add new messages to 'messages' collection in Firebase
  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  // asynch function to load messages from asyncStorage
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
    console.log(this.state.messages)
  };

  // asynch function to save messages to asynchStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // for testing: function to delete the messages during development
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

    // Get user before loading messages so they load on correct side of screen locally
    this.getUser();

    // First load messages from asyncStorage
    this.getMessages();

    // Then check if online to sync with firestore and save any updated messages
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true,
        });
        // for testing
        console.log('online');

        // Authenticate users anonymously
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          //update user state with currently active user data
          this.setState({
            messages: [],
            uid: user.uid,
            // user: {
            //   _id: user.uid,
            //   name: name,
            // }
          });

          // Save uid to asynchStorage
          this.saveUser();

          // Reference to load messages from Firebase
          this.referenceChatMessages = firebase.firestore().collection('messages');
          // Stop listening for changes
          this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        })

        // Add offline note to screen title
        this.props.navigation.setOptions({ title: `${name} (you're offline)` });
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
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
    // Sync fetched messages with asyncStorage (local)
    this.saveMessages();
  };

  // function being called when a user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.saveMessages();
      this.addMessages();
      // for testing
      // this.deleteMessages();
    });
  };

  // function to render custom speech bubble colour
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

  // function to render hiding text input field in offline mode
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  };

  // renderActions = { this.renderCustomActions }

  // Renders action button to send images and location
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  /**
   * displays the communication features
   * @function renderCustomActions
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    // Changing bg-colour based on user input in the start component
    const { color, name } = this.props.route.params;

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
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