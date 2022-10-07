import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const fontWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
];

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '#090C08',
      // fontWeightIdx: 0
    };
  }

  render() {
    // const [fontWeightIdx, setFontWeightIdx] = useState(0);
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../assets/chat_start_backgroundimage.png')} style={styles.image}>
          <Text style={styles.title}>App Title</Text>
          <View style={styles.box}>
            <TextInput
              style={[styles.textField, styles.smallText]}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name" />
            <View style={styles.colorWrapper}>
              <Text style={[styles.smallText, styles.label]}>Choose Background Color:</Text>
              <View style={styles.colors}>
                <TouchableOpacity style={[styles.color, styles.color1]} onPress={() => this.setState({ color: '#090C08' })} />
                <TouchableOpacity style={[styles.color, styles.color2]} onPress={() => this.setState({ color: '#474056' })} />
                <TouchableOpacity style={[styles.color, styles.color3]} onPress={() => this.setState({ color: '#8A95A5' })} />
                <TouchableOpacity style={[styles.color, styles.color4]} onPress={() => this.setState({ color: '#B9C6AE' })} />
              </View>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}>
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    flexDirection: 'column',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    padding: '20%',
    fontSize: 45,
    fontWeight: 600,
    fontWeight: 'bold',
    color: '#fff'
  },

  box: {
    flex: 1,
    width: '88%',
    height: '44%',
    backgroundColor: '#fff',
    marginBottom: '6%',
    paddingTop: '6%',
    paddingBottom: '6%',
    alignItems: 'center',
  },

  textField: {
    width: '88%',
    padding: '2%',
    height: 50,
    borderColor: '#757083',
    borderWidth: 2,
    borderRadius: 2
  },

  smallText: {
    fontSize: 16,
    paddingLeft: '5%',
    fontWeight: 'normal',
    color: '#757083'
  },
  colorWrapper: {
    width: '88%',
    height: '60%',
    justifyContent: 'flex-start',
  },

  label: {
    marginTop: '10%',
    marginBottom: '5%',
  },

  colors: {
    flexDirection: 'row',
  },
  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginLeft: 20,
  },

  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },

  buttonWrapper: {
    width: '88%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    height: 60,
    width: '100%',
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
})