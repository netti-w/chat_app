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
      <ScrollView style={{ backgroundColor: color }}>
        <View style={styles.container}>
          <Text style={styles.text}>Hello World!</Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    flex: 1,
    color: '#000',
  },
});