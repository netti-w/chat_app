# Chat App

## Description
This is a chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.

## Key Features
- A page where users can enter their name and choose a background color for the chat screen before joining the chat.
- A page displaying the conversation, as well as an input field and submit button.
- The chat must provide users with two additional communication features: sending images and location data.
- Data gets stored online and offline.


## Getting Started
Before installing the app, make sure you have a recent version of Node and npm installed. To get a local copy up and running follow these steps. 

### Prerequisites
- [Node.js](https://nodejs.org/en/download/)
- npm
```
npm install -g npm
```

### Installation
In order for this React Native app to run you'll need to have Expo installed and a phone or emulator/ simulator to run it locally.
 
1. Install the Expo Command Line Interface
- To start running Expo, you’ll need to install the Expo Command Line Interface (CLI). To do so, open up your terminal and type in the following command:
```
npm install expo-cli --global
```
2. Clone the Github repo to your local machine
- Make a copy of this [GitHub repository](https://github.com/netti-w/chat_app.git) and save it on your local machine by either downloading it as a zip file or using the git command in your terminal:
```
git clone https://github.com/netti-w/chat_app.git
```
3. Install local dependencies
- Head to the root directory of your repo in your terminal and install all local dependencies by typing the following command in your terminal:
```
npm install
```
4. Start test environment
- You need an Expo account. Head over to the [Expo signup page](https://expo.dev/signup) and follow the instructions to create an account. After completed signup go to your terminal, navigate to the root directory of the GitHub repo and start Expo with:
```
npm start
```
or
```
expo start
```

## Usage
You can test your app with whatever machine you like. However using Expo is recommended to use it on a phone or emulator/ simulator. 

### Run and test the app on your phone
Expo will create project for you, and provide you with scannable QR code. Use your phone to scan QR code, and run it with [Expo App](https://expo.dev/client).

### Run and test the app with an emulator/ simulator:
#### Android Emulator 
First ensure [Android Studio](https://developer.android.com/studio) is installed and configured, then follow instructions in the terminal, pressing  ```a```  to launch Android emulator.

#### iOS Simulator
(Macs only) To test in iOS Simulator, first ensure [XCode](https://apps.apple.com/us/app/xcode/id497799835?mt=12https://apps.apple.com/us/app/xcode/id497799835?mt=12) is installed, then follow instructions in the terminal, pressing  ```i```  to launch iOS simulator.

#### Data storage:
Note: This app is connected to its own Firebase database run by the developer, but feel free to make your own database and connect it to your local version of the app to create a private chat.

## Dependencies (in detail):
- "@react-native-async-storage/async-storage": "^1.17.10",
- "@react-native-community/masked-view": "^0.1.11",
- "@react-native-community/netinfo": "^9.3.4",
- "@react-navigation/native": "^6.0.13",
- "@react-navigation/stack": "^6.3.2",
- "expo": "~46.0.13",
- "expo-image-picker": "^13.3.1",
- "expo-location": "^14.3.0",
- "expo-permissions": "^13.2.0",
- "expo-status-bar": "~1.4.0",
- "firebase": "^7.9.0",
- "react": "18.0.0",
- "react-native": "0.69.6",
- "react-native-gesture-handler": "~2.5.0",
- "react-native-gifted-chat": "^0.16.3",
- "react-native-maps": "^1.3.2",
- "react-native-reanimated": "~2.9.1",
- "react-native-safe-area-context": "4.3.1",
- "react-native-screens": "~3.15.0",
- "react-navigation": "^4.4.4"

## Project screenshots
Start screen
[](../assets/start_screen.jpg)


## Project Repository
[chat_app](https://github.com/netti-w/chat_app)

