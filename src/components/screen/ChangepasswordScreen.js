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
  KeyboardAvoidingView
} from "react-native";
import CustomToolbarwithNav from "../styles/CustomToolbarwithNav";
import { Fonts } from "../../utill/Fonts";
import firebase from "@firebase/app";
import AwesomeAlert from "react-native-awesome-alerts";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

export default class ChangepasswordScreen extends Component {
  static navigationOptions = {
    header: <View />
  };

  constructor(props) {
    super(props);
    this.state = {
      oldpassword: "",
      newpassword: "",
      renewpassword: "",
      loading: false,
      showAlert: false,
      showAlerterror: false
    };
  }

  changePasswordFirebase(oldPassword, newPassword, renewPassword) {
    const user = firebase.auth().currentUser;

    if (
      this.state.oldpassword != "" &&
      this.state.newpassword != "" &&
      this.state.renewpassword != ""
    ) {
      if (newPassword === renewPassword) {
        this.setState({
          loading: true
        });
        const credential = firebase.auth.EmailAuthProvider.credential(
          firebase.auth().currentUser.email,
          oldPassword
        );
        firebase
          .auth()
          .currentUser.reauthenticateWithCredential(credential)
          .then(() => {
            user
              .updatePassword(newPassword)
              .then(() => {
                this.showAlert();
              })
              .catch(error => {
                Alert.alert("", error.toString());
              });
          })
          .catch(error => {
            this.showAlertError();
          });
      } else {
        Alert.alert(
          "รหัสผ่านไม่ตรงกัน",
          "รหัสผ่านที่คุณป้อนไม่ตรงกัน โปรดลองใหม่อีกครั้ง",
          [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
          { cancelable: false }
        );
      }
    } else if (
      oldPassword.length < 6 ||
      newPassword.length < 6 ||
      renewPassword.length < 6
    ) {
      Alert.alert(
        "รหัสผ่านไม่ถูกต้อง",
        "รหัสผ่านที่คุณป้อนสั้นเกินไป (6ตัวขึ้นไป) โปรดลองใหม่อีกครั้ง",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      Alert.alert("ไม่สำเร็จ", "โปรดกรอกข้อมูลให้ครบ", [{ text: "OK" }], {
        cancelable: false
      });
    }
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

  showAlertError = () => {
    this.setState({
      showAlerterror: true,
      loading: false
    });
  };

  hideAlertError = () => {
    this.setState({
      showAlerterror: false
    });
    this.props.navigation.pop(1);
  };

  render() {
    const {
      oldpassword,
      newpassword,
      renewpassword,
      showAlert,
      showAlerterror
    } = this.state;
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
        <CustomToolbarwithNav
          title={this.props.navigation.getParam("title", "Settings")}
          onBackpress={() => {
            this.props.navigation.goBack();
          }}
          onBellpress={() => {
            this.props.navigation.push("notification");
          }}
        />
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={{ flex: 1.5 }}>
              <View style={styles.eachviewContent}>
                <Text style={styles.textHeader}>เปลี่ยนรหัสผ่าน</Text>
              </View>
            </View>
            <View style={{ flex: 12 }}>
              <View
                style={{ padding: windowWidth * 0.05, alignItems: "center" }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: windowheight * 0.005
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 15,
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "#eae5e5",
                        borderRadius: 10
                      }}
                    >
                      <Icon
                        name="lock"
                        size={17}
                        color="#626262"
                        style={{
                          paddingTop: 2,
                          alignSelf: "center",
                          flex: 0.1
                        }}
                      />
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="รหัสผ่านเดิม"
                        placeholderTextColor="#626262"
                        returnKeyType="next"
                        secureTextEntry
                        ref={input => (this.oldpassword = input)}
                        onSubmitEditing={() => this.newpassword.focus()}
                        style={styles.textheaderinput}
                        onChangeText={oldpassword =>
                          this.setState({ oldpassword })
                        }
                        value={this.state.oldpassword}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: windowheight * 0.01
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 15,
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "#eae5e5",
                        borderRadius: 10
                      }}
                    >
                      <Icon
                        name="lock"
                        size={17}
                        color="#626262"
                        style={{
                          paddingTop: 2,
                          alignSelf: "center",
                          flex: 0.1
                        }}
                      />
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="รหัสผ่านใหม่"
                        placeholderTextColor="#626262"
                        returnKeyType="next"
                        secureTextEntry
                        ref={input => (this.newpassword = input)}
                        onSubmitEditing={() => this.renewpassword.focus()}
                        style={styles.textheaderinput}
                        onChangeText={newpassword =>
                          this.setState({ newpassword })
                        }
                        value={this.state.newpassword}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    paddingTop: windowheight * 0.01
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 15,
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "#eae5e5",
                        borderRadius: 10
                      }}
                    >
                      <Icon
                        name="lock"
                        size={17}
                        color="#626262"
                        style={{
                          paddingTop: 2,
                          alignSelf: "center",
                          flex: 0.1
                        }}
                      />
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#626262"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        returnKeyType="done"
                        secureTextEntry
                        ref={input => (this.renewpassword = input)}
                        style={styles.textheaderinput}
                        onChangeText={renewpassword =>
                          this.setState({ renewpassword })
                        }
                        value={this.state.renewpassword}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    this.changePasswordFirebase(
                      oldpassword,
                      newpassword,
                      renewpassword
                    )
                  }
                  style={{
                    backgroundColor: "#F5A623",
                    paddingHorizontal: 25,
                    paddingVertical: 15,
                    marginTop: windowheight * 0.05,
                    borderRadius: 90
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.MosseThai_Medium,
                      color: "#fff",
                      fontSize: 16
                    }}
                  >
                    ยืนยันการเปลี่ยนรหัสผ่าน
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="สำเร็จ !"
          message="การเปลี่ยนรหัสผ่านสำเร็จ"
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

        <AwesomeAlert
          show={showAlerterror}
          showProgress={false}
          title="ไม่สำเร็จ !"
          message="รหัสผ่านเดิมของคุณไม่ถูกต้อง หรือ ไม่สามารถเปลี่ยนรหัสผ่านได้ถ้าเข้าสู่ระบบด้วย Facebook"
          closeOnTouchOutside={false}
          showConfirmButton={true}
          confirmText="Dismiss"
          confirmButtonColor="#DD6B55"
          messageStyle={{
            fontFamily: Fonts.MosseThai_Medium,
            textAlign: "center",
            color: "#2f3640",
            fontSize: 15
          }}
          titleStyle={{
            fontFamily: Fonts.MosseThai_Bold,
            color: "#DD6B55",
            fontSize: 19
          }}
          confirmButtonTextStyle={{
            fontFamily: Fonts.MosseThai_Medium,
            textAlign: "center",
            color: "#fff",
            fontSize: 14
          }}
          onConfirmPressed={() => {
            this.hideAlertError();
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
  eachviewContent: {
    flex: 1,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eae5e5",
    paddingHorizontal: windowWidth * 0.075
  },
  textheaderinput: {
    flex: 1,
    fontFamily: Fonts.MosseThai_Medium,
    color: "#000",
    fontSize: 15,
    paddingVertical: 12
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
  }
});
