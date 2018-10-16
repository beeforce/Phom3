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
  SafeAreaView,
  Linking
} from "react-native";
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
              {this.props.titleState != '' && this.props.detailState != '' ?               
               null :
              <Text style={styles.toolbarTitle}>{this.props.title}</Text>
              }
              {this.props.titleState != '' && this.props.detailState != '' ? 
              <TouchableOpacity
                style={styles.toolbarBellimage_Send}
                onPress={this.props.sendPress}
              >
              <Text style={styles.toolbarTitle}>Send</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity
                style={styles.toolbarBellimage}
                onPress={this.props.onBellpress}
              >
                <Icon name="bell" size={15} color="#f76b1c" />
              </TouchableOpacity>  
              }
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}


export default class HelpSettingScreen extends Component {
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
    if ((title != "", detail != "")) {
      this.setState({ loading: true });
      const userId = firebase.auth().currentUser.uid;
      let data = {
        description: detail
      };
      firebase
        .database()
        .ref(`User/Help/${userId}/${title}`)
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
        "ชื่อหัวเรื่องไม่ถูกต้อง",
        "โปรดใส่ชื่อของหัวเรื่อง",
        [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
        { cancelable: false }
      );
    } else if (detail == "") {
      Alert.alert(
        "รายละเอียดหัวเรื่องไม่ถูกต้อง",
        "โปรดใส่รายละเอียดของหัวเรื่อง",
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
           this.addHelpQuestiontoFirebase(title, detail)
         }}
         onBellpress={() => {
          this.props.navigation.push("notification");
        }}
        titleState = {title}
        detailState = {detail}
       /> 
        <InputScrollView>
          <View style={{ paddingVertical: 15 }}>
            <View style={styles.eachviewContent}>
              <Text style={styles.textHeader}>ต้องการความช่วยเหลือ</Text>
            </View>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#eae5e5",
              paddingVertical: 15
            }}
          >
            <View style={{ flex: 1.5 }}>
              <View style={{ flex: 2, flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text style={styles.textdescripsmall}>โทรศัพท์สอบถาม</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F5A623",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      marginTop: windowheight * 0.02,
                      borderRadius: 90
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.MosseThai_Medium,
                        color: "#fff",
                        fontSize: 14
                      }}
                    >
                      โทร 084-235-6621
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text style={styles.textdescripsmall}>
                    Inbox ผ่าน Facebook
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        "https://www.facebook.com/PhoMe-photo-of-me-running-214796102719011/?__xts__[0]=68.ARDZerSmVtkUv-9TqBH0nJ7wyNUPqtegbJ7wjJuTXvTiGhMx_siGMAqDzEaVPiwysH9e2NCzqyP6bYWKDSIwCvikrHw_Et-Nzbxj9i3KWycN_hO1dHMGSMBH12pjB3r44er5DKOCOEC9GkFoGKYOYKuJ62R22Nmyw7iEmKqZlwT4MOx6XXfi"
                      )
                    }
                    style={{
                      backgroundColor: "#3274db",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      marginTop: windowheight * 0.02,
                      borderRadius: 90
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: Fonts.MosseThai_Medium,
                        color: "#fff",
                        fontSize: 14
                      }}
                    >
                      Phome FB Page
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={[styles.textdescrip, { marginTop: 15 }]}>
                  หรือทิ้งเรื่องไว้ให้เรา
                </Text>
              </View>
            </View>

            <View style={{ flex: 4, padding: windowWidth * 0.05 }}>
              <View
                style={{
                  flex: 1.5,
                  flexDirection: "row",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#eae5e5",
                  borderRadius: 10
                }}
              >
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="หัวเรื่อง"
                  placeholderTextColor="#626262"
                  returnKeyType="next"
                  ref={input => (this.title = input)}
                  onSubmitEditing={() => this.detail.focus()}
                  style={styles.textheaderinput}
                  onChangeText={title => this.setState({ title })}
                  value={this.state.title}
                />
              </View>
              <View
                style={{
                  flex: 5,
                  height: windowheight * 0.3,
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: "#eae5e5",
                  borderRadius: 10,
                  marginTop: 10
                }}
              >
                {/* <InputScrollView
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="interactive"
                  contentContainerStyle={{ flexGrow: 1 }}
                > */}
                <TextInput
                  multiline={true}
                  maxLength={1000}
                  underlineColorAndroid="transparent"
                  placeholder="รายละเอียดขอความช่วยเหลือ"
                  placeholderTextColor="#626262"
                  returnKeyType="done"
                  ref={input => (this.detail = input)}
                  style={[styles.textheaderinput, { textAlignVertical: "top" }]}
                  onChangeText={detail => this.setState({ detail })}
                  value={this.state.detail}
                />
                {/* </InputScrollView> */}
              </View>

              <View style={{ flex: 2, justifyContent: "center" }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.addHelpQuestiontoFirebase(title, detail)
                    }
                    style={{
                      marginHorizontal: windowWidth * 0.025,
                      marginTop: 15
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
                          fontSize: 18
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
          message="เราได้รับการขอความช่วยเหลือของคุณเรียบร้อยแล้ว โปรดรอการติดต่อของแอดมินในภายหลัง"
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
    // borderBottomWidth: 1,
    // borderBottomColor: "#eae5e5",
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
