import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ImageSourcePropType,
} from "react-native";
import Carousel from "./components/Carousel";

interface ImageData {
  id: number;
  title: string;
  imageUrl: ImageSourcePropType;
}

const testImages: ImageData[] = [
  { id: 1, title: "Lake Oeschinen", imageUrl: require("./assets/one.jpg") },
  { id: 2, title: "Matterhorn", imageUrl: require("./assets/two.jpg") },
  { id: 3, title: "Zurich", imageUrl: require("./assets/three.jpg") },
  { id: 4, title: "Hue", imageUrl: require("./assets/four.jpg") },
  { id: 5, title: "Also Matterhorn", imageUrl: require("./assets/five.jpg") },
  { id: 6, title: "Hanoi", imageUrl: require("./assets/six.jpg") },
  { id: 7, title: "Beer", imageUrl: require("./assets/seven.jpg") },
  { id: 8, title: "Zermatt", imageUrl: require("./assets/eight.jpg") },
  // { id: 9, title: "Hue", imageUrl: require("./assets/four.jpg") },
  // { id: 10, title: "Also Matterhorn", imageUrl: require("./assets/five.jpg") },
  // { id: 11, title: "Hanoi", imageUrl: require("./assets/six.jpg") },
  // { id: 12, title: "Beer", imageUrl: require("./assets/seven.jpg") },
];

//<Carousel data={testImages} view="multi" border={false} />
//view can be "single" or "multi" and border can be true or false

export default function App() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Carousel data={testImages} view="multi" border={false} />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#212122",
    flex: 1,
  },
  safeAreaView: {
    marginTop: 50,
    flex: 1,
    justifyContent: "space-around",
  },
});
