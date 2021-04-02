import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { View, Platform, KeyboardAvoidingView, Text } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
      }, 
      isConnected: false,
    };

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAw0gLD6P-SP3zMXI9xVBt-E9deXdu9PwQ",
        authDomain: "chat-app-cef83.firebaseapp.com",
        projectId: "chat-app-cef83",
        storageBucket: "chat-app-cef83.appspot.com",
        messagingSenderId: "904651456442",
        appId: "1:904651456442:web:b9049312d53e8d9e20e783",
        measurementId: "G-J7KWE3PKRS",
      });
    }
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log("online");
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            this.setState({
              isConnected: true,
              messages: [],
              user: {
                _id: user.uid,
                name: this.props.route.params.name,
              },
            });
            this.referenceChatMessages = firebase
              .firestore()
              .collection("messages");
            // orders messages by date/timestamp
            this.unsubscribeChatUser = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("offline");
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeChatUser();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
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

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      ); // can only store strings
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // previousState references the component's state at the time when the change is applied. The append() function appends the new message to the messages object, i.e. the message a user just sent is appended to the state messages so that it can be displayed
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      this.saveMessages();
      }
    );
  }

  // only renders input toolbar when user is online (prevents users from sending messages when offline)
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

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000", // Target right or left bubbles respectively
          },
        }}
      />
    );
  }

  render() {
    let { name, color } = this.props.route.params;
    //   Sets the title as the user's name
    this.props.navigation.setOptions({ title: name });
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: color,
        }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
        />
        {/* No need to add navigation here as Stack.Navigator automatically adds navigation to the top of the screen */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
