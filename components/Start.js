import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      color: "",
    };
  }
  render() {
    return (
      <ImageBackground
        source={require("../assets/Background_Image.png")}
        style={styles.image}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Let's Chat</Text>
          <View style={styles.smallContainer}>
            <View style={styles.textBoxWrapper}>
              <Image
                source={require("../assets/people_icon.png")}
                style={styles.imageStyle}
              />
              <TextInput
                style={styles.text}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder="Your Name"
              />
            </View>

            <Text style={styles.backgroundSelector}>
              Choose Background Color:
            </Text>
            <View style={styles.colorContainer}>
              <TouchableOpacity
                style={styles.color1}
                onPress={() => {
                  this.setState({ color: "#090c08" });
                }}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color2}
                onPress={() => {
                  this.setState({ color: "#474056" });
                }}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color3}
                onPress={() => {
                  this.setState({ color: "#8a95a5" });
                }}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color4}
                onPress={() => {
                  this.setState({ color: "#b9c6ae" });
                }}
              ></TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  color: this.state.color,
                })
              }
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
          {Platform.OS === "android" ? (
            <KeyboardAvoidingView behavior="height" />
          ) : null}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  smallContainer: {
    width: 380,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    flex: 1,
    fontWeight: "300",
    color: "#757083",
    fontSize: 16,
  },
  textBoxWrapper: {
    flexDirection: "row",
    color: "white",
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "left",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    color: "white",
    fontSize: 45,
    fontWeight: "600",
    margin: "5%",
    flex: 0.75,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: "stretch",
    alignItems: "center",
  },
  backgroundSelector: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginLeft: 20,
    marginTop: 5,
  },
  colorContainer: {
    flexDirection: "row",
    marginLeft: 20,
    width: 275,
    marginBottom: 20,
  },
  color1: {
    flex: 1,
    backgroundColor: "#090c08",
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  color2: {
    flex: 1,
    backgroundColor: "#474056",
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  color3: {
    flex: 1,
    backgroundColor: "#8a95a5",
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  color4: {
    flex: 1,
    backgroundColor: "#b9c6ae",
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  button: {
    backgroundColor: "#757083",
    margin: 10,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    margin: 10,
    padding: 10,
  },
});
