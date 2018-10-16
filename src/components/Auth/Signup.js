import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
  DatePickerAndroid,
  DatePickerIOS,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView
} from "react-native";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import { Fonts } from "../../utill/Fonts";
import LinearGradient from "react-native-linear-gradient";
import { provinceList } from "../../utill/Provinces";
import { CountriesList } from "../../utill/Countries";
import DateTimePicker from "react-native-modal-datetime-picker";
import firebase from "firebase";
import AwesomeAlert from "react-native-awesome-alerts";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      birthdate: "",
      birthdateTI: "",
      genderindex: 0,
      gender: "ชาย",
      email: "",
      password: "",
      repassword: "",
      phonenumber: "",
      country: "",
      province: "",
      chooseProvince: false,
      chooseCountries: false,
      disableprovince: true,
      loading: false,
      showAlert: false,
      isDateTimePickerVisible: false
    };
  }

  onButtonPress = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  };

  handleBackButton = () => {
    return true;
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  segmentClick = index => {
    this.setState({
      genderindex: index
    });
    if (index == 0) {
      this.setState({
        gender: "ชาย"
      });
    } else if (index == 1) {
      this.setState({
        gender: "หญิง"
      });
    } else if (index == 2) {
      this.setState({
        gender: "เพศที่3"
      });
    }
  };

  renderSection(index) {
    if (this.state.genderindex == index) {
      return (
        <View
          style={{
            flex: 1,
            borderRadius: 90,
            backgroundColor: "#000",
            margin: windowWidth * 0.025
          }}
        />
      );
    } else {
      return null;
    }
  }

  renderItem(item) {
    return (
      <View
        style={{
          flex: 1,
          width: windowWidth * 0.8,
          borderBottomWidth: 1,
          borderColor: "#eae5e5"
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 15 }}
          onPress={() => {
            this.setState({
              chooseProvince: false,
              province: item.name
            });
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={styles.textgoback}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderItemCountries(item) {
    return (
      <View
        style={{
          flex: 1,
          width: windowWidth * 0.8,
          borderBottomWidth: 1,
          borderColor: "#eae5e5"
        }}
      >
        <TouchableOpacity
          style={{ flex: 1, paddingVertical: 15 }}
          onPress={() => {
            this.setState({
              chooseCountries: false,
              country: item.cn,
              disableprovince: false
            });
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={styles.textgoback}>{item.cn}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  _hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  _handleDatePicked = date => {
    this.setState({
      birthdateTI:
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
      birthdate:
        date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(),
      isDateTimePickerVisible: false
    });
  };

  async openAndroidDatePicker() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        mode: "calendar",
        maxDate: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({
          birthdateTI: day + "/" + (month + 1) + "/" + year,
          birthdate: month + 1 + "/" + day + "/" + year
        });
        if (this.state.email == "") {
          this.email.focus();
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }

  signUpUser = (email, password) => {
    if (
      this.validate(email) &&
      this.state.password.length > 5 &&
      this.state.password == this.state.repassword &&
      this.state.name != "" &&
      this.state.birthdate != "" &&
      this.state.phonenumber != "" &&
      this.state.country != "" &&
      this.state.province != ""
    ) {
      this.setState({ loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          if (user != null) {
            // console.log(user)
            firebase
              .database()
              .ref("User")
              .child("Detail")
              .child(user.user.uid)
              .set({
                Email: user.user.email,
                Name: this.state.name,
                Birthdate: this.state.birthdate,
                Phonenumber: this.state.phonenumber,
                Gender: this.state.gender,
                Country: this.state.country,
                Province: this.state.province,
                Point: 0
              });
            this.showAlert();
          }
        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/weak-password") {
            Alert.alert(
              "รหัสผ่านง่ายเกินไป",
              "รหัสผ่านที่คุณป้อนง่ายเกินไป โปรดลองใหม่อีกครั้ง",
              [{ text: "ลองใหม่อีกครั้ง" }],
              { cancelable: false }
            );          
          } 
          else if (errorCode == "auth/invalid-email") {
            Alert.alert(
              "อีเมลไม่ถูกต้อง",
              "อีเมลที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง",
              [{ text: "ลองใหม่อีกครั้ง" }],
              { cancelable: false }
            );        
          } 
          else if (errorCode == "auth/email-already-in-use") {
            Alert.alert(
              "อีเมลไม่สามารถใช้ได้",
              "อีเมลที่คุณป้อนได้ถูกสมัครสมาชิกไปแล้ว โปรดเปลี่ยนอีเมลในการสมัคร",
              [{ text: "ลองใหม่อีกครั้ง" }],
              { cancelable: false }
            );          
          } 
          else {
            alert(errorMessage);
          }
        });
    } else if (this.state.password != this.state.repassword) {
      Alert.alert(
        "รหัสผ่านไม่ตรงกัน",
        "รหัสผ่านที่คุณป้อนไม่ตรงกัน โปรดลองใหม่อีกครั้ง",
        [{ text: "ลองใหม่อีกครั้ง" }],
        { cancelable: false }
      );
    } else if (!this.validate(email)) {
      Alert.alert(
        "อีเมลไม่ถูกต้อง",
        "อีเมลที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง",
        [{ text: "ลองใหม่อีกครั้ง" }],
        { cancelable: false }
      );
    } else if (this.state.password.length < 6) {
      Alert.alert(
        "รหัสผ่านไม่ถูกต้อง",
        "รหัสผ่านที่คุณป้อนสั้นเกินไป (6ตัวขึ้นไป) โปรดลองใหม่อีกครั้ง",
        [{ text: "ลองใหม่อีกครั้ง" }],
        { cancelable: false }
      );
    } else {
      Alert.alert("ไม่สำเร็จ", "โปรดกรอกข้อมูลให้ครบ", [{ text: "ลองใหม่อีกครั้ง" }], {
        cancelable: false
      });
    }
  };

  loginFirebase = (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          // firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
            this.props.navigation.navigate("Homepage");
          }
          // })
        })
        .catch(error => {
          Alert.alert("", error.toString());
        });
    } catch (error) {
      Alert.alert("", error.toString());
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
      showAlert: true,
      loading: false
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });

    {
      this.loginFirebase(this.state.email, this.state.password);
    }
  };

  render() {
    const { showAlert } = this.state;
    return (
      <SafeAreaView style={styles.container}>
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
              <ActivityIndicator animating={this.state.loading} size="small" />
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.chooseProvince}
          onRequestClose={() => {
            console.log("close modal");
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.chooseProvinceview}>
              <FlatList
                data={provinceList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => this.renderItem(item)}
              />
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.chooseCountries}
          onRequestClose={() => {
            console.log("close modal");
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.chooseProvinceview}>
              <FlatList
                data={CountriesList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => this.renderItemCountries(item)}
              />
            </View>
          </View>
        </Modal>

        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
            style={{ margin: windowWidth * 0.05, alignItems: "center" }}
          >
            <Icon
              name="arrow-up"
              size={22}
              color="#626262"
              style={{ paddingTop: 2 }}
            />
            <Text style={styles.textgoback}>ย้อนกลับ</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            scrollEventThrottle={16}
            contentContainerStyle={{ flexGrow: 1 }}
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { y: this.scrollY } } }
            ])}
            keyboardShouldPersistTaps='handled'
          >
            <View style={styles.content}>
              <Text style={styles.textRegis}>สมัครสมาชิกใหม่</Text>

              <View style={{ alignItems: "center" }}>
                <View style={styles.textinputview}>
                  <TextInput
                    style={styles.textinput}
                    underlineColorAndroid="transparent"
                    placeholder="ชื่อ-นามสกุล"
                    placeholderTextColor="#4a4a4a"
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                    returnKeyType="next"
                    onSubmitEditing={() => this._showDateTimePicker()}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    this._showDateTimePicker();
                  }}
                  style={[
                    styles.textinputview,
                    { justifyContent: "space-between" }
                  ]}
                >
                  {/* <TextInput style = {styles.textinput}
        underlineColorAndroid="transparent"
        placeholder = "วัน/เดือน/ปีเกิด"
        // placeholderTextColor = "#626262"
        value= {this.state.birthdateTI}
        editable = {false}
          /> */}
                  {this.state.birthdate === "" ? (
                    <Text style={[styles.textinput, { color: "#4a4a4a" }]}>
                      วัน/เดือน/ปีเกิด
                    </Text>
                  ) : (
                    <Text style={styles.textinput}>
                      {this.state.birthdateTI}
                    </Text>
                  )}

                  {/* <View style = {{flex: 0.1, justifyContent: 'center'}}> */}
                  <Icon
                    name="calendar"
                    size={15}
                    color="#626262"
                    style={{ paddingTop: 2, alignSelf: "center", flex: 0.1 }}
                  />
                  {/* </View> */}
                </TouchableOpacity>

                <View
                  style={{
                    width: windowWidth * 0.7,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: windowWidth * 0.05
                  }}
                >
                  <Text style={styles.textgender}>เพศ</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      alignSelf: "flex-start"
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.segmentClick(0)}
                      style={styles.genderview}
                    >
                      {this.renderSection(0)}
                    </TouchableOpacity>
                    <Text style={[styles.textgender, { fontSize: 14 }]}>
                      ชาย
                    </Text>
                  </View>

                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => this.segmentClick(1)}
                        style={styles.genderview}
                      >
                        {this.renderSection(1)}
                      </TouchableOpacity>
                      <Text style={[styles.textgender, { fontSize: 14 }]}>
                        หญิง
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => this.segmentClick(2)}
                        style={styles.genderview}
                      >
                        {this.renderSection(2)}
                      </TouchableOpacity>
                      <Text style={[styles.textgender, { fontSize: 14 }]}>
                        เพศที่3
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.textinputview}>
                  <TextInput
                    style={styles.textinput}
                    underlineColorAndroid="transparent"
                    placeholder="Email Address"
                    keyboardType="email-address"
                    placeholderTextColor="#4a4a4a"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                    returnKeyType="next"
                    onSubmitEditing={() => this.password.focus()}
                    ref={input => (this.email = input)}
                  />
                </View>

                <View style={styles.textinputview}>
                  <TextInput
                    style={styles.textinput}
                    underlineColorAndroid="transparent"
                    placeholder="Password"
                    placeholderTextColor="#4a4a4a"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                    returnKeyType="next"
                    secureTextEntry
                    onSubmitEditing={() => this.repassword.focus()}
                    ref={input => (this.password = input)}
                  />
                </View>

                <View style={styles.textinputview}>
                  <TextInput
                    style={styles.textinput}
                    underlineColorAndroid="transparent"
                    placeholder="Password Confirm"
                    placeholderTextColor="#4a4a4a"
                    onChangeText={repassword => this.setState({ repassword })}
                    value={this.state.repassword}
                    returnKeyType="next"
                    secureTextEntry
                    onSubmitEditing={() => this.phonenumber.focus()}
                    ref={input => (this.repassword = input)}
                  />
                </View>

                <View style={styles.textinputview}>
                  <TextInput
                    style={styles.textinput}
                    underlineColorAndroid="transparent"
                    placeholder="Phone Number"
                    placeholderTextColor="#4a4a4a"
                    onChangeText={phonenumber => this.setState({ phonenumber })}
                    value={this.state.phonenumber}
                    returnKeyType="done"
                    keyboardType="numeric"
                    maxLength={10}
                    ref={input => (this.phonenumber = input)}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      chooseCountries: true
                    });
                  }}
                  style={[
                    styles.textinputview,
                    { justifyContent: "space-between" }
                  ]}
                >
                  {this.state.country === "" ? (
                    <Text style={[styles.textinput, { color: "#4a4a4a" }]}>
                      Country
                    </Text>
                  ) : (
                    <Text style={styles.textinput}>{this.state.country}</Text>
                  )}
                  <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <Icon
                      name="angle-down"
                      size={20}
                      color="#626262"
                      style={{ paddingTop: 2, alignSelf: "center" }}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      chooseProvince: true
                    });
                  }}
                  disabled={this.state.disableprovince}
                  style={
                    !this.state.disableprovince
                      ? [
                          styles.textinputview,
                          { justifyContent: "space-between" }
                        ]
                      : [
                          styles.textinputview,
                          {
                            justifyContent: "space-between",
                            backgroundColor: "#EEEEEE"
                          }
                        ]
                  }
                >
                  {this.state.province === "" ? (
                    <Text style={[styles.textinput, { color: "#4a4a4a" }]}>
                      Province/State
                    </Text>
                  ) : (
                    <Text style={styles.textinput}>{this.state.province}</Text>
                  )}
                  <View style={{ flex: 0.1, justifyContent: "center" }}>
                    <Icon
                      name="angle-down"
                      size={20}
                      color={
                        !this.state.disableprovince ? "#626262" : "#EEEEEE"
                      }
                      style={{ paddingTop: 2, alignSelf: "center" }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{ alignItems: "center", marginTop: windowHeight * 0.03 }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.signUpUser(this.state.email, this.state.password)
                  }
                  style={{ width: windowWidth * 0.75 }}
                >
                  <LinearGradient
                    colors={["#fad961", "#f76b1c"]}
                    style={styles.buttonConfirm}
                  >
                    <Text style={styles.textconfirm}>ยืนยันการสมัครสมาชิก</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="สำเร็จ !"
            message="การสมัครสมาชิกสำเร็จ"
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    overflow: "hidden",
    paddingVertical: windowHeight * 0.01
  },
  textgoback: {
    fontFamily: Fonts.MosseThai_Medium,
    color: "#626262",
    fontSize: 15
  },
  content: {
    flex: 1,
    paddingHorizontal: windowWidth * 0.1,
    marginBottom: windowHeight * 0.02
  },
  textRegis: {
    fontFamily: Fonts.MosseThai_Bold,
    color: "#000",
    fontSize: 18,
    marginBottom: 10
  },
  textgender: {
    fontFamily: Fonts.MosseThai_Bold,
    color: "#000",
    fontSize: 16,
    paddingHorizontal: 5
  },
  textinput: {
    flex: 1,
    fontFamily: Fonts.MosseThai_Medium,
    color: "#000",
    fontSize: 15,
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
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  genderview: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    borderRadius: (windowWidth * 0.1) / 2,
    backgroundColor: "#fff"
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000040"
  },
  chooseProvinceview: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
    // marginVertical: windowWidth * 0.2,
    // marginHorizontal: windowWidth * 0.05
  },
  textconfirm: {
    fontFamily: Fonts.MosseThai_Bold,
    color: "#fff",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  buttonConfirm: {
    flex: 1,
    justifyContent: "center",
    borderRadius: windowWidth * 0.1,
    paddingVertical: windowWidth * 0.035,
    alignItems: "center"
  },
  activityIndicatorWrapper: {
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent"
  }
});
