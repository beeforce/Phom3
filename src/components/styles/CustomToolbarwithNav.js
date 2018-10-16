import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Fonts } from "../../utill/Fonts";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import LinearGradient from "react-native-linear-gradient";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

export default class CustomToolbarwithNav extends Component {
  render() {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <LinearGradient colors={["#fad961", "#f76b1c"]}>
          <SafeAreaView>
            <View style={{ height: 56, justifyContent: "center" }}>
              <TouchableOpacity
                onPress={this.props.onBackpress}
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  padding: 15,
                  paddingLeft: 20,
                  paddingRight: 20
                }}
              >
                <Icon
                  name="arrow-left"
                  size={22}
                  color="#fff"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.75)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2
                  }}
                />
              </TouchableOpacity>

              <Text style={styles.toolbarTitle}>{this.props.title}</Text>
              <TouchableOpacity
                style={styles.toolbarBellimage}
                onPress={this.props.onBellpress}
              >
                <Icon name="bell" size={15} color="#f76b1c" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbarTitle: {
    fontSize: 18,
    fontFamily: Fonts.MosseThai_Bold,
    color: "#fff",
    alignSelf: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  toolbarBellimage: {
    height: 35,
    width: 35,
    borderRadius: 18,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  }
});
