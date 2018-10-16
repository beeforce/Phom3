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
  FlatList,
  KeyboardAvoidingView
} from "react-native";
import CustomToolbarwithNav from "../styles/CustomToolbarwithNav";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import { Fonts } from "../../utill/Fonts";
import { TextInputMask, TextMask } from "react-native-masked-text";
import firebase from "@firebase/app";
import AwesomeAlert from "react-native-awesome-alerts";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class ChoosecardButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardnumber: ""
    };
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.getuserinformationCurrent(userId);
  }

  getuserinformationCurrent = userId => {
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .on("value", snapshot => {
        let cardnumber = snapshot.child("cardnumber").val();

        this.setState({
          cardnumber: cardnumber
        });
      });
  };

  render() {
    const { cardnumber } = this.state;
    if (cardnumber == this.props.cardNumber) {
      return (
        <View style={styles.checkButton}>
          <Icon name="check" size={18} color="#fff" />
        </View>
      );
    } else {
      return <View style={styles.uncheckButton} />;
    }
  }
}

export default class PaymentCardScreen extends Component {
  static navigationOptions = {
    header: <View />
  };

  constructor(props) {
    super(props);
    this.state = {
      creditcardNumber: "",
      expiredate: "",
      cvvNumber: "",
      loading: false,
      userProfileCurrent: [],
      showAlertaddCard: false
    };
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.getuserinformationCurrent(userId);
  }

  addCardNumbertoFirebase(cardNumber, expiredate, cvvNumber) {
    let cardNumber_ = cardNumber.replace(/\s/g, "");
    if (
      cardNumber_.length > 15 &&
      expiredate.length > 0 &&
      cvvNumber.length > 0
    ) {
      this.setState({
        loading: true
      });
      const userId = firebase.auth().currentUser.uid;
      let data = {
        cardNumber: cardNumber_
      };
      firebase
        .database()
        .ref(`User/Detail/${userId}/Card`)
        .push(data)
        .then(() => {
          this.showAlertaddCard();
        });
    } else if (cardNumber_.length < 16) {
      Alert.alert(
        "เลขบัตรไม่ถูกต้อง",
        "เลขบัตรที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง",
        [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
        { cancelable: false }
      );
    } else if (expiredate.length == 0) {
      Alert.alert(
        "วันหมดอายุของบัตรไม่ถูกต้อง",
        "โปรดป้อนวันหมดอายุบัตรของคุณ",
        [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
        { cancelable: false }
      );
    } else if (cvvNumber.length == 0) {
      Alert.alert(
        "เลขหลังบัตรไม่ถูกต้อง",
        "โปรดป้อนเลขหลังบัตรของคุณ",
        [{ text: "OK", onPress: () => this.setState({ loading: false }) }],
        { cancelable: false }
      );
    }
  }

  // async openRefillSuccesspage(cardnumber, expiration_month, expiration_year, security_code){
  //     this.setState({
  //         loading: true,
  //       });
  //     const data = await Omise.createToken({
  //         'card': {
  //             'name': 'JOHN DOE',
  //             // 'city': 'Bangkok',
  //             // 'postal_code': 10320,
  //             'number': cardnumber,
  //             'expiration_month': Number(expiration_month),
  //             'expiration_year': Number(expiration_year),
  //             'security_code': Number(security_code)
  //         }
  //     }).then(() => {
  //         this.setState({
  //             loading: false,
  //             })
  //         })
  // }

  addcardnumberDetail = cardId => {
    const userId = firebase.auth().currentUser.uid;
    let data = {
      cardnumber: cardId
    };
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .update(data)
      .then(() => {});
  };

  getuserinformationCurrent = userId => {
    firebase
      .database()
      .ref(`User/Detail/${userId}/Card`)
      .on("value", dataSnapshot => {
        let UserCardnumber = [];
        dataSnapshot.forEach(child => {
          child.forEach(eachchild => {
            UserCardnumber.push({
              _cardNumber: eachchild.val(),
              _key: child.key
            });
          });
        });

        this.setState({
          userProfileCurrent: UserCardnumber
        });
      });
  };

  showAlertaddCard = () => {
    this.setState({
      showAlertaddCard: true,
      loading: false
    });
  };

  hideAlertaddCard = () => {
    this.setState({
      showAlertaddCard: false,
      creditcardNumber: "",
      expiredate: "",
      cvvNumber: ""
    });
  };

  renderCardList(item) {
    return (
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
            value={item._cardNumber}
            type={"credit-card"}
            options={{
              obfuscated: true
            }}
            style={[
              styles.textconfirm,
              { paddingHorizontal: 10, fontSize: 14 }
            ]}
          />
          {/* <Text style = {[styles.textconfirm,{paddingHorizontal: 10,}]}>{item._cardNumber}</Text> */}
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
        <TouchableOpacity
          onPress={() => this.addcardnumberDetail(item._cardNumber)}
        >
          <ChoosecardButton cardNumber={item._cardNumber} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      creditcardNumber,
      showAlertaddCard,
      expiredate,
      cvvNumber
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
          title={this.props.navigation.getParam("title", "Setting")}
          onBackpress={() => {
            this.props.navigation.goBack();
          }}
          onBellpress={() => {
            this.props.navigation.push("notification");
          }}
        />
        <KeyboardAwareScrollView 
        contentContainerStyle = {{flexGrow: 1}}>

          {this.state.userProfileCurrent.length > 0 ? (
            <View
              style={styles.container}
              // contentContainerStyle={{ flexGrow: 1 }}
            >
              <View>
                <View style={styles.eachviewContent}>
                  <Text style={styles.textHeader}>การชำระเงิน</Text>
                </View>

                <FlatList
                  data={this.state.userProfileCurrent}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => this.renderCardList(item)}
                />
              </View>
              <View style={{ justifyContent: "space-between" }}>
                <View
                  style={{ padding: windowWidth * 0.05, alignItems: "center" }}
                >
                  <Text style={styles.textconfirm}>หรือ เพิ่มใหม่</Text>

                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: windowWidth * 0.05
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#eae5e5",
                          borderRadius: 10
                        }}
                      >
                        <View style={{ flex: 0.15, justifyContent: "center" }}>
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
                          // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                          // ref = {(input) => this.place = input}
                          onSubmitEditing={() => this.expiredate.focus()}
                          type={"credit-card"}
                          maxLength={19}
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
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#eae5e5",
                          borderRadius: 10
                        }}
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
                          maxLength={5}
                          onSubmitEditing={() => this.cvvNumber.focus()}
                          placeholder="MM/YY"
                          placeholderTextColor="#626262"
                          type={"datetime"}
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
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#eae5e5",
                          borderRadius: 10
                        }}
                      >
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

                  <TouchableOpacity
                    onPress={() =>
                      this.addCardNumbertoFirebase(
                        creditcardNumber,
                        expiredate,
                        cvvNumber
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
                      เพิ่มบัตร
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.container}>
              <View style={{ flex: 1.5 }}>
                <View style={styles.eachviewContent}>
                  <Text style={styles.textHeader}>การชำระเงิน</Text>
                </View>
              </View>
              <View style={{ flex: 12, justifyContent: "space-between" }}>
                <View
                  style={{ padding: windowWidth * 0.05, alignItems: "center" }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: windowWidth * 0.05
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#eae5e5",
                          borderRadius: 10
                        }}
                      >
                        <View style={{ flex: 0.15, justifyContent: "center" }}>
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
                          maxLength={19}
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
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#eae5e5",
                          borderRadius: 10
                        }}
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
                          maxLength={5}
                          onSubmitEditing={() => this.cvvNumber.focus()}
                          placeholder="MM/YY"
                          placeholderTextColor="#626262"
                          type={"datetime"}
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
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#eae5e5",
                          borderRadius: 10
                        }}
                      >
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

                  <TouchableOpacity
                    onPress={() =>
                      this.addCardNumbertoFirebase(
                        creditcardNumber,
                        expiredate,
                        cvvNumber
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
                      เพิ่มบัตร
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
        <AwesomeAlert
          show={showAlertaddCard}
          showProgress={false}
          title="สำเร็จ !"
          message="เพิ่มบัตรเคตดิตของคุณเรียบร้อยแล้ว"
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
            this.hideAlertaddCard();
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
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eae5e5",
    paddingHorizontal: windowWidth * 0.05,
    paddingVertical: windowWidth * 0.03
  },
  textconfirm: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 16,
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
  uncheckButton: {
    width: windowWidth * 0.085,
    height: windowWidth * 0.085,
    borderRadius: (windowWidth * 0.085) / 2,
    backgroundColor: "#EEEEEE",
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
