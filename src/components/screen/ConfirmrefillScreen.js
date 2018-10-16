import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from "react-native";
import CustomToolbarwithNav from "../styles/CustomToolbarwithNav";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import LinearGradient from "react-native-linear-gradient";
import { Fonts } from "../../utill/Fonts";
import { TextInputMask } from "react-native-masked-text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextMask } from "react-native-masked-text";
import firebase from "@firebase/app";
import moment from "moment";
import Omise from "omise-react-native";
//set public key and secret key
Omise.config("pkey_test_52q8e5f058psbkmayob", "skey_test_52q8e5f04p9qxx75r9c");

export default class ConfirmrefillScreen extends Component {
  static navigationOptions = {
    header: <View />
  };

  constructor(props) {
    super(props);
    this.state = {
      creditcardNumber: "",
      expiredate: "",
      cvvNumber: "",
      confirmRefill: true,
      refillSuccess: false,
      loading: false,
      userProfileCurrent: {},
      useoldCard: false,
      savecardNumber: false
    };
  }

  async openRefillSuccesspage(coin, price) {
    this.setState({
      loading: true
    });
    price = price + "00";
    const data = await Omise.createToken({
      card: {
        name: "JOHN DOE",
        // 'city': 'Bangkok',
        // 'postal_code': 10320,
        number: "4242424242424242",
        expiration_month: Number("10"),
        expiration_year: Number("2018"),
        security_code: Number("123")
      }
    });
    const charge = await Omise.createCharge({
      card: data.id,
      amount: Number(price),
      currency: "thb"
    }).then(charge => {
      if (charge.id != null) {
        const userId = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref("User/Detail")
          .child(`${userId}`)
          .update({
            Point: this.state.userProfileCurrent.point + coin
          })
          .then(() => {
            let date = new Date();
            firebase
              .database()
              .ref(`History/${userId}/Point`)
              .push({
                Point: coin,
                DateTime: moment(date).format('HH:mm:ss')+'. '+moment(date).format('l'),
                type: "Add"
              })
              .then((snapshot) => {
                firebase
                  .database()
                  .ref(`Notification/${userId}`)
                  .push({
                    HistoryId: snapshot.key,
                    read: false,
                    date:
                      moment(date).format("l") +
                      " " +
                      moment(date).format("HH:mm:ss"),
                    type: "cartPoint",
                    title: coin
                  });
                this.setState({
                  confirmRefill: false,
                  refillSuccess: true,
                  loading: false
                });
              });
          });
      }
    });

    // const charge = await Omise.createSource({
    //     amount: 100,
    //     currency: "thb",
    //     'type': 'internet_banking_bbl',
    //   })
  }

  async changeandAddcardNumber(coin, price, cardnumber) {
    if (cardnumber.length > 15) {
      this.setState({
        loading: true
      });
      price = price + "00";
      const data = await Omise.createToken({
        card: {
          name: "JOHN DOE",
          // 'city': 'Bangkok',
          // 'postal_code': 10320,
          number: "4242424242424242",
          expiration_month: Number("10"),
          expiration_year: Number("2018"),
          security_code: Number("123")
        }
      });
      const charge = await Omise.createCharge({
        card: data.id,
        amount: Number(price),
        currency: "thb"
      }).then(charge => {
        if (charge.id != null) {
          const userId = firebase.auth().currentUser.uid;
          firebase
            .database()
            .ref("User/Detail")
            .child(`${userId}`)
            .update({
              Point: this.state.userProfileCurrent.point + coin
            })
            .then(() => {
              let date = new Date();
              firebase
                .database()
                .ref(`History/${userId}/Point`)
                .push({
                  Point: coin,
                  DateTime: moment(date).format('HH:mm:ss')+'. '+moment(date).format('l'),
                  type: "Add"
                })
                .then((snapshot) => {
                    firebase
                    .database()
                    .ref(`Notification/${userId}`)
                    .push({
                      HistoryId: snapshot.key,
                      read: false,
                      date:
                      moment(date).format("l") +
                      " " +
                      moment(date).format("HH:mm:ss"),
                      type: "cartPoint",
                      title: coin
                    });
                  this.setState({
                    confirmRefill: false,
                    refillSuccess: true,
                    loading: false
                  });
                });
            });

          if (this.state.savecardNumber == true) {
            this.addcardnumberDetail(cardnumber);
          }
        }
      });
    } else {
        Alert.alert(
            "เลขบัตรไม่ถูกต้อง",
            "เลขบัตรที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง",
            [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
            { cancelable: false }
          );
        }
      }

  addcardnumberDetail = cardId => {
    const userId = firebase.auth().currentUser.uid;
    let data = {
      cardnumber: cardId.replace(/\s/g, "")
    };
    firebase
      .database()
      .ref(`User/Detail/${userId}/Card`)
      .push(data)
      .then(() => {
        firebase
          .database()
          .ref(`User/Detail/${userId}`)
          .update(data)
          .then(() => {});
      });
  };

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.getuserinformationCurrent(userId);
  }

  getuserinformationCurrent = userId => {
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .on("value", snapshot => {
        let UserdetailProfile = {};
        UserdetailProfile.name = snapshot.child("Name").val();
        UserdetailProfile.point = snapshot.child("Point").val();
        UserdetailProfile.cardnumber = snapshot.child("cardnumber").val();

        this.setState({
          userProfileCurrent: UserdetailProfile
        });
      });
  };

  render() {
    const coin = this.props.navigation.getParam("coin");
    const price = this.props.navigation.getParam("price");
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
          title={this.props.navigation.getParam("title", "เติมแต้ม")}
          onBackpress={() => {
            this.props.navigation.goBack();
          }}
          onBellpress={() => {
            this.props.navigation.push("notification");
          }}
        />
        <SafeAreaView style={styles.container}>
          <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {this.state.confirmRefill ? (
              <View style={styles.container}>
                {this.state.userProfileCurrent.cardnumber != null ? (
                  <View style={styles.container}>
                    <View style={{ flex: 7 }}>
                      <View style={styles.eachviewContent}>
                        <Text style={styles.textHeader}>สรุปการเติมแต้ม</Text>
                      </View>

                      <View
                        style={{
                          flex: 2,
                          paddingHorizontal: windowWidth * 0.05,
                          paddingVertical: windowWidth * 0.04,
                          borderBottomWidth: 1,
                          borderBottomColor: "#eae5e5"
                        }}
                      >
                        <View
                          style={{
                            flex: 1.4,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "baseline"
                          }}
                        >
                          <Text style={styles.textconfirm}>
                            ยอด Point ณ ตอนนี้
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "baseline"
                            }}
                          >
                            <Icon
                              name="coffee"
                              size={22}
                              color="#F5A623"
                              style={{ paddingHorizontal: 5 }}
                            />
                            <Text
                              style={[
                                styles.textHeader,
                                { paddingHorizontal: 5, fontSize: 20 }
                              ]}
                            >
                              {this.state.userProfileCurrent.point}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: "#eae5e5",
                            paddingBottom: 3
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              borderBottomWidth: 1,
                              borderBottomColor: "#eae5e5",
                              justifyContent: "space-between",
                              alignItems: "baseline"
                            }}
                          >
                            <Text
                              style={[styles.textconfirm, { color: "#F5A623" }]}
                            >
                              เติม Pack {coin} แต้ม (รวมค่าธรรมเนียม)
                            </Text>
                            <Text style={[styles.textHeader, { fontSize: 23 }]}>
                              {price}
                              .-
                            </Text>
                          </View>
                        </View>
                        <View style={{ flex: 0.2 }} />
                      </View>

                      <View
                        style={[
                          styles.eachviewContent,
                          {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          <Icon
                            name="cc-visa"
                            size={24}
                            color="#000"
                            style={{ paddingHorizontal: 10 }}
                          />
                          <TextMask
                            value={this.state.userProfileCurrent.cardnumber}
                            type={"credit-card"}
                            options={{
                              obfuscated: true
                            }}
                            style={[
                              styles.textconfirm,
                              { paddingHorizontal: 10, fontSize: 14 }
                            ]}
                          />
                          {/* <Text style = {[styles.textconfirm,{paddingHorizontal: 10,}]}>{this.state.userProfileCurrent.cardnumber}</Text> */}
                          <Text
                            style={[
                              styles.textconfirm,
                              {
                                color: "#F5A623",
                                paddingHorizontal: 10,
                                textDecorationLine: "underline"
                              }
                            ]}
                          >
                            แก้ไข
                          </Text>
                        </View>
                        {this.state.useoldCard ? (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                useoldCard: false,
                                creditcardNumber: ""
                              });
                            }}
                          >
                            <View style={styles.checkButton}>
                              <Icon name="check" size={18} color="#fff" />
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                useoldCard: true,
                                creditcardNumber: this.state.userProfileCurrent
                                  .cardnumber
                              });
                            }}
                          >
                            <View style={styles.uncheckButton} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View style={{ flex: 10, justifyContent: "space-between" }}>
                      <View
                        style={{
                          padding: windowWidth * 0.05,
                          alignItems: "center"
                        }}
                      >
                        <Text style={styles.textconfirm}>หรือ</Text>

                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: windowWidth * 0.05
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <View
                              style={
                                !this.state.useoldCard
                                  ? styles.textinputView
                                  : styles.textinputViewdisable
                              }
                            >
                              <View
                                style={{ flex: 0.15, justifyContent: "center" }}
                              >
                                <Icon
                                  name="credit-card"
                                  size={17}
                                  color={
                                    !this.state.useoldCard
                                      ? "#626262"
                                      : "#EEEEEE"
                                  }
                                  style={{ paddingTop: 2, alignSelf: "center" }}
                                />
                              </View>
                              <TextInputMask
                                refInput={ref => (this.creditcardNumber = ref)}
                                underlineColorAndroid="transparent"
                                placeholder="หมายเลขบัตรเครดิต 16 หลัก"
                                placeholderTextColor="#626262"
                                returnKeyType="done"
                                // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                                // ref = {(input) => this.place = input}
                                onSubmitEditing={() => this.expiredate.focus()}
                                maxLength = {19}
                                type={"credit-card"}
                                style={
                                  !this.state.useoldCard
                                    ? styles.textheaderinput
                                    : styles.textheaderinputdisable
                                }
                                onChangeText={creditcardNumber =>
                                  this.setState({ creditcardNumber })
                                }
                                value={this.state.creditcardNumber}
                                editable={!this.state.useoldCard}
                              />
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: windowWidth * 0.04
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <View
                              style={
                                !this.state.useoldCard
                                  ? styles.textinputView
                                  : styles.textinputViewdisable
                              }
                            >
                              {/* <TextInput style = {styles.textheaderinput}
            underlineColorAndroid='transparent'
            returnKeyType = "next"
            keyboardType = "numeric"
            placeholder = "MM/YY"
            placeholderTextColor = "#000"
            onChangeText={(expiredate) => this.setState({expiredate})}
            ref = {(input) => this.expiredate = input}
            onSubmitEditing = {() => this.cvvNumber.focus()}
            value= {this.state.expiredate}
            /> */}
                              <TextInputMask
                                refInput={ref => (this.expiredate = ref)}
                                underlineColorAndroid="transparent"
                                returnKeyType="done"
                                keyboardType="numeric"
                                onSubmitEditing={() => this.cvvNumber.focus()}
                                placeholder="MM/YY"
                                maxLength = {5}
                                placeholderTextColor={
                                  !this.state.useoldCard ? "#626262" : "#EEEEEE"
                                }
                                type={"datetime"}
                                onChangeText={expiredate =>
                                  this.setState({ expiredate })
                                }
                                value={this.state.expiredate}
                                style={
                                  !this.state.useoldCard
                                    ? styles.textheaderinput
                                    : styles.textheaderinputdisable
                                }
                                options={{
                                  format: "MM/YY"
                                }}
                                editable={!this.state.useoldCard}
                              />
                            </View>
                          </View>
                          <View style={{ flex: 0.1 }} />
                          <View style={{ flex: 1 }}>
                            <View
                              style={
                                !this.state.useoldCard
                                  ? styles.textinputView
                                  : styles.textinputViewdisable
                              }
                            >
                              <TextInput
                                style={
                                  !this.state.useoldCard
                                    ? styles.textheaderinput
                                    : styles.textheaderinputdisable
                                }
                                underlineColorAndroid="transparent"
                                returnKeyType="done"
                                keyboardType="numeric"
                                placeholder="CVV"
                                maxLength={3}
                                placeholderTextColor={
                                  !this.state.useoldCard ? "#626262" : "#EEEEEE"
                                }
                                onChangeText={cvvNumber =>
                                  this.setState({ cvvNumber })
                                }
                                ref={input => (this.cvvNumber = input)}
                                value={this.state.cvvNumber}
                                editable={!this.state.useoldCard}
                              />
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: windowWidth * 0.04,
                            justifyContent: "center",
                            alignItems: "flex-start"
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                savecardNumber: !this.state.savecardNumber
                              })
                            }
                          >
                            <View style={styles.uncheckButton2}>
                              {this.state.savecardNumber == true ? (
                                <View style={styles.insideuncheckButton2} />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.textconfirm,
                              { alignSelf: "center" }
                            ]}
                          >
                            บันทึกข้อมูลบัตรเครดิตไว้ใช้ครั้งต่อไป
                          </Text>
                        </View>
                      </View>

                      <View>
                        <Text
                          style={[
                            styles.textconfirm,
                            { textAlign: "center", alignSelf: "center" }
                          ]}
                        >
                          คุณยินยอมที่จะให้หักเงิน {price}
                          .- บาท
                        </Text>
                        <Text
                          style={[
                            styles.textconfirm,
                            { textAlign: "center", alignSelf: "center" }
                          ]}
                        >
                          หลังจากกดปุ่ม Confirm แล้ว
                        </Text>
                        {!this.state.useoldCard ? (
                          <TouchableOpacity
                            style={{
                              marginHorizontal: windowWidth * 0.025,
                              marginBottom: 15
                            }}
                            onPress={() => {
                              this.changeandAddcardNumber(
                                coin,
                                price,
                                this.state.creditcardNumber
                              );
                            }}
                          >
                            <LinearGradient
                              colors={["#fad961", "#f76b1c"]}
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                borderRadius: 10,
                                paddingVertical: windowWidth * 0.035,
                                marginTop: 10
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
                                CONFIRM
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{
                              marginHorizontal: windowWidth * 0.025,
                              marginBottom: 15
                            }}
                            onPress={() => {
                              this.openRefillSuccesspage(coin, price);
                            }}
                          >
                            <LinearGradient
                              colors={["#fad961", "#f76b1c"]}
                              style={{
                                flex: 1,
                                justifyContent: "center",
                                borderRadius: 10,
                                paddingVertical: windowWidth * 0.035,
                                marginTop: 10
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
                                CONFIRM
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.container}>
                    <View style={styles.eachviewContent}>
                      <Text style={styles.textHeader}>สรุปการเติมแต้ม</Text>
                    </View>

                    <View
                      style={{
                        flex: 2,
                        paddingHorizontal: windowWidth * 0.05,
                        paddingVertical: windowWidth * 0.04,
                        borderBottomWidth: 1,
                        borderBottomColor: "#eae5e5"
                      }}
                    >
                      <View
                        style={{
                          flex: 1.4,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "baseline"
                        }}
                      >
                        <Text style={styles.textconfirm}>
                          ยอด Point ณ ตอนนี้
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "baseline"
                          }}
                        >
                          <Icon
                            name="coffee"
                            size={22}
                            color="#F5A623"
                            style={{ paddingHorizontal: 5 }}
                          />
                          <Text
                            style={[
                              styles.textHeader,
                              { paddingHorizontal: 5, fontSize: 20 }
                            ]}
                          >
                            {this.state.userProfileCurrent.point}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderBottomWidth: 1,
                          borderBottomColor: "#eae5e5",
                          paddingBottom: 3
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            borderBottomWidth: 1,
                            borderBottomColor: "#eae5e5",
                            justifyContent: "space-between",
                            alignItems: "baseline"
                          }}
                        >
                          <Text
                            style={[styles.textconfirm, { color: "#F5A623" }]}
                          >
                            เติม Pack {coin} แต้ม (รวมค่าธรรมเนียม)
                          </Text>
                          <Text style={[styles.textHeader, { fontSize: 23 }]}>
                            {price}
                            .-
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 0.2 }} />
                    </View>

                    <View style={{ flex: 10, justifyContent: "space-between" }}>
                      <View
                        style={{
                          padding: windowWidth * 0.05,
                          alignItems: "center"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: windowWidth * 0.05
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <View style={styles.textinputView}>
                              <View
                                style={{ flex: 0.15, justifyContent: "center" }}
                              >
                                <Icon
                                  name="credit-card"
                                  size={17}
                                  color="#626262"
                                  style={{ paddingTop: 2, alignSelf: "center" }}
                                />
                              </View>
                              <TextInputMask
                                refInput={ref => (this.creditcardNumber = ref)}
                                underlineColorAndroid="transparent"
                                placeholder="หมายเลขบัตรเครดิต 16 หลัก"
                                placeholderTextColor="#626262"
                                returnKeyType="done"
                                maxLength = {19}
                                // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                                // ref = {(input) => this.place = input}
                                onSubmitEditing={() => this.expiredate.focus()}
                                type={"credit-card"}
                                style={styles.textheaderinput}
                                onChangeText={creditcardNumber =>
                                  this.setState({ creditcardNumber })
                                }
                                value={this.state.creditcardNumber}
                              />
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: windowWidth * 0.04
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <View style={styles.textinputView}>
                              {/* <TextInput style = {styles.textheaderinput}
            underlineColorAndroid='transparent'
            returnKeyType = "next"
            keyboardType = "numeric"
            placeholder = "MM/YY"
            placeholderTextColor = "#000"
            onChangeText={(expiredate) => this.setState({expiredate})}
            ref = {(input) => this.expiredate = input}
            onSubmitEditing = {() => this.cvvNumber.focus()}
            value= {this.state.expiredate}
            /> */}
                              <TextInputMask
                                refInput={ref => (this.expiredate = ref)}
                                underlineColorAndroid="transparent"
                                returnKeyType="done"
                                keyboardType="numeric"
                                onSubmitEditing={() => this.cvvNumber.focus()}
                                placeholder="MM/YY"
                                placeholderTextColor="#626262"
                                type={"datetime"}
                                maxLength = {5}
                                onChangeText={expiredate =>
                                  this.setState({ expiredate })
                                }
                                value={this.state.expiredate}
                                style={styles.textheaderinput}
                                options={{
                                  format: "MM/YY"
                                }}
                              />
                            </View>
                          </View>
                          <View style={{ flex: 0.1 }} />
                          <View style={{ flex: 1 }}>
                            <View style={styles.textinputView}>
                              <TextInput
                                style={styles.textheaderinput}
                                underlineColorAndroid="transparent"
                                returnKeyType="done"
                                keyboardType="numeric"
                                placeholder="CVV"
                                maxLength={3}
                                placeholderTextColor="#626262"
                                onChangeText={cvvNumber =>
                                  this.setState({ cvvNumber })
                                }
                                ref={input => (this.cvvNumber = input)}
                                value={this.state.cvvNumber}
                              />
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            paddingTop: windowWidth * 0.04,
                            justifyContent: "center",
                            alignItems: "flex-start"
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                savecardNumber: !this.state.savecardNumber
                              })
                            }
                          >
                            <View style={styles.uncheckButton2}>
                              {this.state.savecardNumber == true ? (
                                <View style={styles.insideuncheckButton2} />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                          <Text
                            style={[
                              styles.textconfirm,
                              { alignSelf: "center" }
                            ]}
                          >
                            บันทึกข้อมูลบัตรเครดิตไว้ใช้ครั้งต่อไป
                          </Text>
                        </View>
                      </View>

                      <View>
                        <Text
                          style={[
                            styles.textconfirm,
                            { textAlign: "center", alignSelf: "center" }
                          ]}
                        >
                          คุณยินยอมที่จะให้หักเงิน {price}
                          .- บาท
                        </Text>
                        <Text
                          style={[
                            styles.textconfirm,
                            { textAlign: "center", alignSelf: "center" }
                          ]}
                        >
                          หลังจากกดปุ่ม Confirm แล้ว
                        </Text>
                        <TouchableOpacity
                          style={{
                            marginHorizontal: windowWidth * 0.025,
                            marginBottom: 15
                          }}
                          onPress={() => {
                            this.changeandAddcardNumber(
                              coin,
                              price,
                              this.state.creditcardNumber
                            );
                          }}
                        >
                          <LinearGradient
                            colors={["#fad961", "#f76b1c"]}
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              borderRadius: 10,
                              paddingVertical: windowWidth * 0.035,
                              marginTop: 10
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
                              CONFIRM
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : null}

            {this.state.refillSuccess ? (
              <View style={styles.container}>
                <View
                  style={{
                    flex: 1.5,
                    alignItems: "center",
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "#eae5e5",
                    paddingHorizontal: windowWidth * 0.05
                  }}
                >
                  <Text style={[styles.textHeader, { color: "#F5A623" }]}>
                    ยินดีด้วย{" "}
                  </Text>
                  <Text style={styles.textHeader}>สรุปการเติมแต้ม</Text>
                </View>
                <View style={{ flex: 15.25, alignItems: "center" }}>
                  <View style={{ flex: 0.2 }} />
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <View style={styles.checkButton2}>
                      <Icon name="check" size={50} color="#fff" />
                    </View>
                    <Text style={[styles.textconfirm, { textAlign: "center" }]}>
                      ชำระเงินเรียบร้อยแล้ว
                    </Text>
                    <Text style={[styles.textconfirm, { textAlign: "center" }]}>
                      แต้มของคุณเพิ่มใหม่ เป็น
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "baseline" }}
                    >
                      <Icon
                        name="coffee"
                        size={22}
                        color="#F5A623"
                        style={{ paddingHorizontal: 5 }}
                      />
                      <Text
                        style={[
                          styles.textHeader,
                          { paddingHorizontal: 5, fontSize: 20 }
                        ]}
                      >
                        {this.state.userProfileCurrent.point}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                >
                  <TouchableOpacity
                    style={{
                      marginHorizontal: windowWidth * 0.025,
                      marginBottom: 15
                    }}
                    onPress={() => {
                      this.props.navigation.pop(2);
                    }}
                  >
                    <LinearGradient
                      colors={["#fad961", "#f76b1c"]}
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        borderRadius: 10,
                        paddingVertical: windowWidth * 0.035
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
                        BACK TO PHOTO
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

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
    paddingHorizontal: windowWidth * 0.05,
    paddingVertical: windowWidth * 0.025
  },
  textinputView: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eae5e5",
    borderRadius: 10
  },
  textinputViewdisable: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eae5e5",
    borderRadius: 10,
    backgroundColor: "#EEEEEE"
  },
  textconfirm: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 14,
    color: "#5a5a5a"
  },
  checkButton: {
    width: windowWidth * 0.085,
    height: windowWidth * 0.085,
    borderRadius: (windowWidth * 0.085) / 2,
    backgroundColor: "#F5A623",
    alignItems: "center",
    justifyContent: "center"
  },
  checkButton2: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    borderRadius: (windowWidth * 0.4) / 2,
    backgroundColor: "#F5A623",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  textheaderinput: {
    flex: 1,
    fontFamily: Fonts.MosseThai_Medium,
    color: "#000",
    fontSize: 15,
    padding: 12
  },
  textheaderinputdisable: {
    flex: 1,
    fontFamily: Fonts.MosseThai_Medium,
    color: "#EEEEEE",
    fontSize: 15,
    padding: 12
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
  uncheckButton: {
    width: windowWidth * 0.085,
    height: windowWidth * 0.085,
    borderRadius: (windowWidth * 0.085) / 2,
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center"
  },
  uncheckButton2: {
    width: windowWidth * 0.09,
    height: windowWidth * 0.09,
    borderRadius: (windowWidth * 0.9) / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eae5e5",
    marginRight: 10
  },
  insideuncheckButton2: {
    width: windowWidth * 0.05,
    height: windowWidth * 0.05,
    backgroundColor: "#F5A623",
    borderRadius: (windowWidth * 0.5) / 2
  }
});
