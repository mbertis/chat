import React from "react";
import { View, Platform, KeyboardAvoidingView, Text } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      loggedInText: "Please wait, you are being logged in" // Messages are stored in state
    };

    if(!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAw0gLD6P-SP3zMXI9xVBt-E9deXdu9PwQ",
        authDomain: "chat-app-cef83.firebaseapp.com",
        projectId: "chat-app-cef83",
        storageBucket: "chat-app-cef83.appspot.com",
        messagingSenderId: "904651456442",
        appId: "1:904651456442:web:b9049312d53e8d9e20e783",
        measurementId: "G-J7KWE3PKRS"
      })
    }
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        loggedInText: "Hello there",
      });
      this.referenceChatMessagesUser = null;
      this.unsubscribeChatUser = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);
    });

    
    let joinMessage = `${this.props.route.params.name} has entered the chat`;
    this.setState({
      messages: [
        // {
        //   _id: 1,
        //   text: "Hello Developer",
        //   createdAt: new Date(),
        //   user: {
        //     _id: 2,
        //     name: "React Native",
        //     avatar: "https://placeimg.com/140/140/any",
        //   },
        // },
        {
          _id: 2,
          text: joinMessage,
          createdAt: new Date(),
          system: true,
        },
      ],
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
  }

  addMessage() {
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      text: messages.text,
      createdAt: messages.createdAt,
      user: messages.user,
    });
  }

  // previousState references the component's state at the time when the change is applied. The append() function appends the new message to the messages object, i.e. the message a user just sent is appended to the state messages so that it can be displayed
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => this.addMessage());
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
        <Text
          style={{
            textAlign: "center", opacity: 50, color: "gray"}}>{this.state.loggedInText}</Text>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
        {/* No need to add navigation here as Stack.Navigator automatically adds navigation to the top of the screen */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
