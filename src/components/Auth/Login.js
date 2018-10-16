import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  BackHandler,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  Modal,
  ActivityIndicator,
  ScrollView,
  SafeAreaView
} from "react-native";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import { Fonts } from "../../utill/Fonts";
import LinearGradient from "react-native-linear-gradient";
import firebase from "@firebase/app";
import AwesomeAlert from "react-native-awesome-alerts";
import { AccessToken, LoginManager } from "react-native-fbsdk";

var config = {
  apiKey: "AIzaSyDfLPDifqbQRI1EM1peTvHAbUtE87N4Z9U",
  authDomain: "phome-a2e7f.firebaseapp.com",
  databaseURL: "https://phome-a2e7f.firebaseio.com",
  projectId: "phome-a2e7f",
  storageBucket: "phome-a2e7f.appspot.com",
  messagingSenderId: "359021211490"
};
firebase.initializeApp(config);

console.ignoredYellowBox = ["Setting a timer"];

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: "",
      Password: "",
      loading: false,
      showAlert: false
    };
  }

  onButtonPress = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  };

  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  loginWithFacebook() {
    LoginManager.logInWithReadPermissions(["public_profile", "email"])
      .then(result => {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            this.setState({
              loading: true
            });
            const credential = firebase.auth.FacebookAuthProvider.credential(
              data.accessToken
            );
            // firebase.auth().signInWithCredential(credential)
            firebase
              .auth()
              .signInAndRetrieveDataWithCredential(credential)
              .then(user => {
                firebase.auth().onAuthStateChanged(user => {
                  if (user != null) {
                    console.log("user" + user.email);
                    firebase
                      .database()
                      .ref("User")
                      .child("Detail")
                      .child(user.uid)
                      .once("value", snapshot => {
                        if (snapshot.child("Point").val() === null) {
                          firebase
                            .database()
                            .ref("User")
                            .child("Detail")
                            .child(user.uid)
                            .set({
                              Name: user.displayName,
                              Email: user.email,
                              PhotoURL: user.photoURL + "?type=large",
                              Point: 0
                            })
                            .then(() => {
                              this.setState({
                                loading: false
                              });
                              this.props.navigation.navigate("HomepageCustomer");
                            });
                        } else {
                          this.setState({
                            loading: true
                          });
                          this.props.navigation.navigate("HomepageCustomer");
                        }
                      });
                    //   firebase.database().ref('Photos').child('วิ่งแบบพี่ตูน').push({
                    //     bib: 1005,
                    //     uri : 'https://firebasestorage.googleapis.com/v0/b/test-fb2a3.appspot.com/o/dataImages%2F21.jpg?alt=media&token=a8e8045c-cf44-499d-a113-fa82249fdaf5',
                    //     photoGrapherID: user.uid
                    //   }).then((snapshot) => {
                    //     firebase.database().ref('User').child('Photo').child(user.uid).child('Post').child('วิ่งแบบพี่ตูน').child(snapshot.key).set({
                    //       bib: 1005,
                    //       uri : 'https://firebasestorage.googleapis.com/v0/b/test-fb2a3.appspot.com/o/dataImages%2F21.jpg?alt=media&token=a8e8045c-cf44-499d-a113-fa82249fdaf5',
                    //       photoGrapherID: user.uid
                    //     });
                    //  })
                  } else {
                    this.showAlert();
                  }
                });
              })
              .catch(error => {
                console.log(error);
                LoginManager.logOut();
                firebase.auth().signOut();
              });
          });
        }
      })
      .catch(error => {
        if (AccessToken.getCurrentAccessToken() != null) {
          LoginManager.logOut();
          firebase.auth().signOut();
          this.showAlert();
        }
      });
  }

  loginFirebase = (email, password) => {
    if (this.validate(email) && password.length > 5) {
      this.setState({ loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          firebase.auth().onAuthStateChanged(user => {
            if (user != null) {
              this.props.navigation.navigate("HomepageCustomer");
            }
          });
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === "auth/invalid-email") {
            Alert.alert(
              "อีเมลของคุณไม่ถูกต้อง",
              "อีเมลที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง",
              [
                { text: "ลองใหม่อีกครั้ง", onPress: () => this.setState({ loading: false }) }
              ],
              { cancelable: false }
            );
          } else if (errorCode === "auth/wrong-password") {
            Alert.alert(
              "รหัสผ่านไม่ถูกต้อง",
              "รหัสผ่านที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง",
              [
                { text: "OK", onPress: () => this.setState({ loading: false }) }
              ],
              { cancelable: false }
            );
          } else if (errorCode === "auth/user-not-found") {
            Alert.alert(
              "ไม่พบบัญชีผู้ใช้",
              "ดูเหมือนว่า " +
                email +
                " จะไม่ตรงกับบัญชีผู้ใช้ที่มีอยู่ โปรดลองใหม่อีกครั้งหรือสมัครสมาชิกได้ตอนนี้",
              [
                {
                  text: "สร้างบัญชีผู้ใช้",
                  onPress: () => {
                    this.setState({ loading: false })
                    this.props.navigation.navigate("Signup");
                  }
                },
                {
                  text: "ลองอีกครั้ง",
                  onPress: () => 
                    this.setState({ loading: false })
                  }
              ],
              { cancelable: false }
            );
          } else {
            alert(errorMessage);
          }
        });
    } else if (!this.validate(email)) {
      Alert.alert(
        "อีเมลไม่ถูกต้อง",
        "อีเมลที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง",
        [{ text: "ลองใหม่อีกครั้ง" }],
        { cancelable: false }
      );
    } else if (password.length < 6) {
      Alert.alert(
        "รหัสผ่านไม่ถูกต้อง",
        "รหัสผ่านที่คุณป้อนสั้นเกินไป (6ตัวขึ้นไป) โปรดลองใหม่อีกครั้ง",
        [{ text: "ลองใหม่อีกครั้ง" }],
        { cancelable: false }
      );
    }
  };

  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  render() {
    const { showAlert } = this.state;
    return (
      <SafeAreaView style = {styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1, flex: 1}}
        keyboardShouldPersistTaps='handled'
          >
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
                size="large"
                color="#000"
              />
            </View>
          </View>
        </Modal>

        <View style={{ flex: 1.2, paddingVertical: windowHeight * 0.01 }}>
          <View
            style={{
              flex: 1,
              marginBottom: 5,
              paddingHorizontal: windowWidth * 0.24
            }}
          >
            <Image
              style={{ flex: 1, width: null, height: null }}
              resizeMode="contain"
              source={require("../../images/Phome_logo.png")}
            />
          </View>
          <View style={{ flex: 0.25, justifyContent: 'flex-start' }}>
            <Text style={[styles.registertext, { fontSize: 17 }]}>
              ภาพวิ่งสวยๆ ในราคาเบาๆ
            </Text>
          </View>
        </View>

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={styles.textinputview}>
            <View style={{ flex: 0.1, justifyContent: "center" }}>
              <Icon
                name="envelope"
                size={18}
                color="#626262"
                style={{ paddingTop: 2, alignSelf: "center" }}
              />
            </View>
            <TextInput
              style={styles.textinput}
              underlineColorAndroid="transparent"
              placeholder="Email"
              onChangeText={Email => this.setState({ Email })}
              value={this.state.Email}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => this.passwordInput.focus()}
            />
          </View>
          <View style={styles.textinputview}>
            <View style={{ flex: 0.1, justifyContent: "center" }}>
              <Icon
                name="lock"
                size={18}
                color="#626262"
                style={{ paddingTop: 2, alignSelf: "center" }}
              />
            </View>
            <TextInput
              style={styles.textinput}
              underlineColorAndroid="transparent"
              placeholder="Password"
              onChangeText={Password => this.setState({ Password })}
              value={this.state.Password}
              returnKeyType="go"
              secureTextEntry
              blurOnSubmit = {true}
              ref={input => (this.passwordInput = input)}
              onSubmitEditing={() =>
                this.loginFirebase(this.state.Email, this.state.Password)
              }
            />
          </View>
          {/* <TouchableOpacity 
          style={[styles.LoginButton2,{marginVertical: 15}]} */}
          {/* > */}
          <TouchableOpacity
            // onPress={() => this.loginFirebase("bonobo@gmail.com", "asdasd")}
            onPress={() =>
              this.loginFirebase(this.state.Email, this.state.Password)
            }
          >
            <LinearGradient
              colors={["#fad961", "#f76b1c"]}
              style={[
                styles.LoginButton2,
                { marginVertical: 15, paddingVertical: 15 }
              ]}
            >
              <Text style={styles.LoginTextstyle2}>LOGIN</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* </TouchableOpacity> */}
          <Text style={[styles.registertext, { fontSize: 17 }]}>OR</Text>
        </View>

        <View
          style={{
            flex: 0.6,
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: windowHeight * 0.06
          }}
        >
          <TouchableOpacity
            style={[
              styles.LoginButton2,
              { flexDirection: "row", paddingVertical: 15 }
            ]}
            onPress={() => this.loginWithFacebook()}
          >
            <Icon
              name="facebook-square"
              style={styles.icon}
              size={20}
              color="#fff"
            />
            <Text style={styles.LoginTextstyle}>LOGIN WITH FACEBOOK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Signup")}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.registertext}>สมัครสมาชิก</Text>
            <Icon
              name="caret-down"
              style={styles.icon}
              size={19}
              color="#484848"
            />
          </TouchableOpacity>
        </View>

        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="ไม่สำเร็จ !"
          message="ไม่สามารถล็อคอินเข้าสู่ระบบได้ กรุณาลองอีกครั้ง"
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
            this.hideAlert();
          }}
        />
      </ScrollView>
      </SafeAreaView>
    );
  }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  LoginButton2: {
    width: windowWidth * 0.75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#358be8"
  },
  LoginTextstyle: {
    color: "#ffffff",
    fontFamily: Fonts.MosseThai_Regular,
    alignSelf: "center",
    fontSize: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  LoginTextstyle2: {
    color: "#ffffff",
    fontFamily: Fonts.MosseThai_Bold,
    alignSelf: "center",
    fontSize: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  icon: {
    paddingHorizontal: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  registertext: {
    color: "#484848",
    fontFamily: Fonts.MosseThai_Regular,
    alignSelf: "center",
    fontSize: 20
  },
  textinput: {
    flex: 1,
    fontFamily: Fonts.MosseThai_Medium,
    color: "#000",
    fontSize: 17,
    paddingLeft: 10
  },
  textinputview: {
    width: windowWidth * 0.75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    marginVertical: 3,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#00000040"
  },
  activityIndicatorWrapper: {
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent"
  }
});
