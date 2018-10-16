import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from "react-native";
import { Picker } from "native-base";
import { Fonts } from "../../utill/Fonts";
import AwesomeAlert from "react-native-awesome-alerts";
import LinearGradient from "react-native-linear-gradient";
import InputScrollView from "react-native-input-scroll-view";
import firebase from "@firebase/app";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

class CustomToolbar extends Component {
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
              {this.props.titleState != "" &&
              this.props.detailState != "" ? null : (
                <Text style={styles.toolbarTitle}>{this.props.title}</Text>
              )}
              {this.props.titleState != "" && this.props.detailState != "" ? (
                <TouchableOpacity
                  style={styles.toolbarBellimage_Send}
                  onPress={this.props.sendPress}
                >
                  <Text style={styles.toolbarTitle}>Send</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.toolbarBellimage}
                  onPress={this.props.onBellpress}
                >
                  <Icon name="bell" size={15} color="#f76b1c" />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}

export default class RecommendAppScreen extends Component {
  static navigationOptions = {
    header: <View />
  };

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      detail: "",
      showAlert: false,
      loading: false
    };
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
      loading: false
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
    this.props.navigation.pop(1);
  };

  addHelpQuestiontoFirebase(title, detail) {
    if (detail != "" && title != "") {
      this.setState({ loading: true });
      const userId = firebase.auth().currentUser.uid;
      let data = {
        description: detail
      };
      firebase
        .database()
        .ref(`User/Review/${userId}/${title}`)
        .update(data)
        .then(() => {
          this.showAlert();
        })
        .catch(error => {
          Alert.alert(
            "",
            error.toString(),
            [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
            { cancelable: false }
          );
        });
    } else if (title == "") {
      Alert.alert(
        "หัวข้อคำติชมไม่ถูกต้อง",
        "โปรดเลือกหัวข้อคำติชมที่คุณป้อน",
        [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
        { cancelable: false }
      );
    } else if (detail == "") {
      Alert.alert(
        "คำติชมไม่ถูกต้อง",
        "โปรดป้อนคำติชมของคุณ",
        [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
        { cancelable: false }
      );
    }
  }

  render() {
    const { showAlert, title, detail } = this.state;
    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.loading}
          onRequestClose={() => {
            console.log("close modal");
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                animating={this.state.loading}
                size="small"
                color="#000"
              />
            </View>
          </View>
        </Modal>
        <CustomToolbar
          title={this.props.navigation.getParam("title", "Settings")}
          onBackpress={() => {
            this.props.navigation.goBack();
          }}
          sendPress={() => {
            this.addHelpQuestiontoFirebase(title, detail);
          }}
          onBellpress={() => {
            this.props.navigation.push("notification");
          }}
          titleState={title}
          detailState={detail}
        />

        <InputScrollView>
          <View style={{ paddingVertical: 15 }}>
            <View style={styles.eachviewContent}>
              <Text style={styles.textHeader}>ข้อแนะนำติชม</Text>
            </View>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#eae5e5"
            }}
          >
            <View style={{ flex: 1, padding: windowWidth * 0.05 }}>
              <View
                style={{
                  paddingVertical: 10,
                  borderWidth: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  borderColor: "#eae5e5",
                  borderRadius: 90,
                }}
              >
                {/* <TextInput
                underlineColorAndroid='transparent'
                placeholder = "เลือกหัวข้อแนะนำติชม"
                placeholderTextColor = "#626262"
                returnKeyType = "next"
                ref = {(input) => this.title = input}
                onSubmitEditing = {() => this.detail.focus()}
                style = {styles.textheaderinput}
                onChangeText={(title) => this.setState({title})}
                value= {this.state.title}
            /> */}
                {/* <Picker selectedValue={this.state.title} 
            headerTitleStyle = {{color: '#000', fontSize: 20}}
            onValueChange={(itemValue) => this.setState({title: itemValue})}
            >
            <Picker.Item label="เกี่ยวกับแอปพลิเคชั่น" value="เกี่ยวกับแอปพลิเคชั่น" />
            <Picker.Item label="การบริการ" value="การบริการ" />
            <Picker.Item label="เกี่ยวกับบัญชี" value="เกี่ยวกับบัญชี" />
            <Picker.Item label="อื่นๆ" value="อื่นๆ" />
            </Picker> */}

                <Picker
                  selectedValue={this.state.title}
                  style={{ height: null, width: null }}
                  onValueChange={itemValue =>
                    this.setState({ title: itemValue })
                  }
                  headerTitleStyle={{
                    fontSize: 16,
                    fontFamily: Fonts.MosseThai_Bold
                  }}
                  iosHeader="เลือกหัวข้อติชม"
                  itemTextStyle={{
                    color: "#000",
                    fontFamily: Fonts.MosseThai_Regular
                  }}
                  textStyle={{
                    color: "#000",
                    fontFamily: Fonts.MosseThai_Regular,
                    fontSize: 18
                  }}
                  iosIcon={
                    <Icon
                      name="caret-down"
                      style={styles.icon}
                      size={19}
                      color="#484848"
                    />
                  }
                  placeholder="เลือกหัวข้อคำติชม"
                  placeholderStyle={{ color: "#626262" }}
                >
                  <Picker.Item
                    label="เกี่ยวกับแอปพลิเคชั่น"
                    value="เกี่ยวกับแอปพลิเคชั่น"
                  />
                  <Picker.Item label="การบริการ" value="การบริการ" />
                  <Picker.Item label="เกี่ยวกับบัญชี" value="เกี่ยวกับบัญชี" />
                  <Picker.Item label="อื่นๆ" value="อื่นๆ" />
                </Picker>
              </View>
              <View
                style={{
                  height: windowheight * 0.45,
                  paddingVertical: 5,
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: "#eae5e5",
                  borderRadius: 10,
                  marginTop: 15
                }}
              >
                
                  <TextInput
                    multiline
                    maxLength={1000}
                    // numberOfLines={7}
                    underlineColorAndroid="transparent"
                    placeholder="เขียนคำแนะนำติชมได้ที่นี่"
                    placeholderTextColor="#626262"
                    ref={input => (this.detail = input)}
                    style={[
                      styles.textheaderinput,
                      {
                        textAlignVertical: "top",
                        fontFamily: Fonts.MosseThai_Regular
                      }
                    ]}
                    onChangeText={detail => this.setState({ detail })}
                    value={this.state.detail}
                  />
              </View>

              <View style={{ flex: 1.5, justifyContent: "center" }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.addHelpQuestiontoFirebase(title, detail)
                    }
                    style={{
                      marginHorizontal: windowWidth * 0.025,
                      marginVertical: 15
                    }}
                  >
                    <LinearGradient
                      colors={["#fad961", "#f76b1c"]}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        paddingVertical: 15
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Fonts.MosseThai_Bold,
                          color: "#fff",
                          fontSize: 18,
                          alignSelf: "center"
                        }}
                      >
                        ยืนยันส่งข้อมูลให้เรา
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </InputScrollView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="สำเร็จ !"
          message="เราได้รับการติชมของคุณเรียบร้อยแล้ว ขอบคุณครับ/ค่ะ"
          closeOnTouchOutside={false}
          showConfirmButton={true}
          confirmText="ตกลง"
          confirmButtonColor="#7bd834"
          messageStyle={{
            fontFamily: Fonts.MosseThai_Medium,
            textAlign: "center",
            color: "#2f3640",
            fontSize: 15
          }}
          titleStyle={{
            fontFamily: Fonts.MosseThai_Bold,
            color: "#7bd834",
            fontSize: 19
          }}
          confirmButtonTextStyle={{
            fontFamily: Fonts.MosseThai_Medium,
            textAlign: "center",
            color: "#fff",
            fontSize: 14
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  }
}

const windowheight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  textHeader: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 18,
    color: "#5a5a5a"
  },
  textdescrip: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 15,
    color: "#5a5a5a"
  },
  textdescripsmall: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 13,
    color: "#5a5a5a"
  },
  eachviewContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: windowWidth * 0.075
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040"
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent"
  },
  textheaderinput: {
    flex: 1,
    fontFamily: Fonts.MosseThai_Medium,
    color: "#000",
    fontSize: 16,
    padding: 12,
    paddingLeft: 20
  },
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
  },
  toolbarBellimage_Send: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  }
});
