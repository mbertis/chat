import React from "react";
import { View, Text } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [], // Messages are stored in state
    };
  }
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello Developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
      ],
    });
  }

  // previousState references the component's state at the time when the change is applied. The append() function appends the new message to the messages object, i.e. the message a user just sent is appended to the state messages so that it can be displayed
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
          style={{backgroundColor: color}}
          />
        {/* No need to add navigation here as Stack.Navigator automatically adds navigation to the top of the screen */}
      </View>
    );
  }
}
