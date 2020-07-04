import React from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { ListItem, Button } from "react-native-elements";

export default function unitSelector({ units }) {
  return (
    <View>
      {units.map((item, i) => (
        <ListItem
          key={i}
          title={item.title}
          leftIcon={{ name: item.icon }}
          bottomDivider
          chevron
          onPress={() => {
            AsyncStorage.setItem("units", item.id);
          }}
          badge={item.badge}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
