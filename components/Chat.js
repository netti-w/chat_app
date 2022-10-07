import React from 'react';
import { StyleSheet, View, Text, Button, ScrollView } from 'react-native';


export default class Chat extends React.Component {
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  };

  render() {

    const { color } = this.props.route.params;

    return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Text>Hello Screen2!</Text>
      // </View>
      <View style={[{ backgroundColor: color }, styles.container]}>
        <Text style={styles.text}>Welcome to the chat</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    color: '#fff',
  },
});