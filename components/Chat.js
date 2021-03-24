import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component {
  render() {
      let { name, color } = this.props.route.params;
    //   Sets the title as the user's name
      this.props.navigation.setOptions({ title: name });
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: color }}>
        <Text>Hello Chat!</Text>
        {/* No need to add navigation here as Stack.Navigator automatically adds navigation to the top of the screen */}
      </View>
    );
  }
}
