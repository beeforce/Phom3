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
import FastImage from "react-native-fast-image";
import { BankAccountList } from "../../utill/BankAccount";

class ChoosecardButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankAccountNo: ""
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
        let bankAccountNo = snapshot.child("bankAccountNo").val();

        this.setState({
          bankAccountNo: bankAccountNo
        });
      });
  };

  render() {
    const { bankAccountNo } = this.state;
    if (bankAccountNo == this.props.cardNumber) {
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

export default class AddBankAccount extends Component {
  static navigationOptions = {
    header: <View />
  };

  constructor(props) {
    super(props);
    this.state = {
      accountNumber: "",
      name: "",
      bank: "ธนาคาร",
      branch: "",
      loading: false,
      userProfileCurrent: [],
      showAlertaddCard: false,
      chooseBankAccount: false
    };
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.getuserinformationCurrent(userId);
  }

  addBankaccounttoFirebase(bankaccountno, name, bank, branch){
    let bankaccountno_ = bankaccountno.replace(/\s/g, "")
    if(bankaccountno_.length > 12 && name != '' && bank != '' && branch != ''){
    this.setState({
        loading: true,
      })
    const userId = firebase.auth().currentUser.uid;
    let data = {
        bankAccountNo: bankaccountno_,
        name: name,
        Bank: bank,
        branch: branch
    }
    firebase.database().ref(`User/Detail/${userId}/BankAccount`).push(data).then(()=> {
        this.showAlertaddCard()
      })
    }
    else if(bankaccountno_.length < 13){
        Alert.alert('เลขบัญชีไม่ถูกต้อง',
          'เลขบัญชีที่คุณป้อนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง', [{text: 'OK', onPress: () => this.setState({loading: false})}], { cancelable: false });
    }
    else if(bank == ''){
        Alert.alert('ชื่อธนาคารไม่ถูกต้อง',
          'โปรดเลือกธนาคารของบัญชีของคุณ', [{text: 'OK', onPress: () => this.setState({loading: false})}], { cancelable: false });
    }
    else{
        Alert.alert('ไม่สำเร็จ',
          'กรุณากรอกข้อมูลให้ครบ', [{text: 'OK', onPress: () => this.setState({loading: false})}], { cancelable: false });
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
      bankAccountNo: cardId
    };
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .update(data)
      .then(() => {});
  };

  getuserinformationCurrent = userId => {
    // firebase.database().ref(`User/Detail/${userId}/Card`).on('value', (dataSnapshot) => {
    firebase
      .database()
      .ref(`User/Detail/${userId}/BankAccount`)
      .on("value", dataSnapshot => {
        let UserCardnumber = [];
        dataSnapshot.forEach(child => {
          UserCardnumber.push({
            Bank: child.val().Bank,
            bankAccountNo: child.val().bankAccountNo,
            branch: child.val().branch,
            name: child.val().name,
            _key: child.key
          });
        });
        console.log(UserCardnumber);

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
      accountNumber: "",
      name: "",
      bank: "",
      branch: ""
    });
  };

  renderBankaccountLogo(bank) {
    if (bank == "ธนาคารกรุงเทพ") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/krungthep.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารกสิกรไทย") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/kbank.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารกรุงไทย") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/krungthai.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารทหารไทย") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/tmb.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารไทยพาณิชย์") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/scb.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารซีไอเอ็มบีไทย") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/cimb.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารธนชาต") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/thanachat.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารยูโอบี") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/uob.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารออมสิน") {
      return (
        <View style={styles.BankaccountImageView}>
          <FastImage
            style={styles.BankaccountImage}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/rmsin.png")}
          />
        </View>
      );
    } else {
      return <View style={styles.BankaccountImageView} />;
    }
  }

  renderBankaccountLogoforTextInput(bank) {
    if (bank == "ธนาคารกรุงเทพ") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/krungthep.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารกสิกรไทย") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/kbank.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารกรุงไทย") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/krungthai.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารทหารไทย") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/tmb.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารไทยพาณิชย์") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/scb.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารซีไอเอ็มบีไทย") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/cimb.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารธนชาต") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/thanachat.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารยูโอบี") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/uob.png")}
          />
        </View>
      );
    } else if (bank == "ธนาคารออมสิน") {
      return (
        <View style={styles.BankaccountImageView2}>
          <FastImage
            style={styles.BankaccountImage2}
            resizeMode={FastImage.resizeMode.contain}
            source={require("../../images/rmsin.png")}
          />
        </View>
      );
    }
  }

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
          {this.renderBankaccountLogo(item.Bank)}
          <View style={{ paddingHorizontal: 10 }}>
            <TextMask
              value={item.bankAccountNo}
              type={"custom"}
              options={{
                mask: "999-9-99999-9",
                suffixUnit: "#"
              }}
              // type={'credit-card'}
              // options={{
              // 	obfuscated: true
              // }}
              style={[styles.textconfirm, { fontSize: 15, lineHeight: 17 }]}
            />
            <Text
              style={[
                styles.textconfirm,
                {
                  fontSize: 11,
                  fontFamily: Fonts.MosseThai_Medium,
                  lineHeight: 13
                }
              ]}
            >
              {item.name}
            </Text>
          </View>
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
          onPress={() => this.addcardnumberDetail(item.bankAccountNo)}
        >
          <ChoosecardButton cardNumber={item.bankAccountNo} />
        </TouchableOpacity>
      </View>
    );
  }

  renderItemBankaccount(item) {
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
          style={{ flex: 1, paddingVertical: 15, paddingLeft: 30 }}
          onPress={() => {
            this.setState({
              chooseBankAccount: false,
              bank: item.name
            });
            this.branch.focus();
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: windowWidth * 0.085,
                height: windowWidth * 0.085,
                borderRadius: (windowWidth * 0.085) / 2,
                backgroundColor: "#fff",
                marginRight: 15
              }}
            >
              <FastImage
                source={item.image}
                style={{
                  width: windowWidth * 0.085,
                  height: windowWidth * 0.085,
                  borderRadius: (windowWidth * 0.085) / 2
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <Text style={styles.textgoback}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { accountNumber, name, bank, branch, showAlertaddCard } = this.state;
    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.loading}
          onRequestClose={() => {}}
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator animating={this.state.loading} size={40} />
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType={"none"}
          visible={this.state.chooseBankAccount}
          onRequestClose={() => {}}
        >
          <View style={styles.modalBackground}>
            <View style={styles.chooseProvinceview}>
              <FlatList
                data={BankAccountList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => this.renderItemBankaccount(item)}
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
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          {this.state.userProfileCurrent.length > 0 ? (
            <ScrollView
              style={styles.container}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View>
                <View style={styles.eachviewContent}>
                  <Text style={styles.textHeader}>บัญชีรับเงินถอน</Text>
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
                            name="book"
                            size={17}
                            color="#626262"
                            style={{ paddingTop: 2, alignSelf: "center" }}
                          />
                        </View>
                        {/* <TextInput
				ref={(input) => this.accountNumber = input}
                underlineColorAndroid='transparent'
                placeholder = "เลขที่บัญชี"
                placeholderTextColor = "#626262"
                returnKeyType = "next"
                // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                // ref = {(input) => this.place = input}
                onSubmitEditing = {() => this.name.focus()}
                style = {styles.textheaderinput}
                onChangeText={(accountNumber) => this.setState({accountNumber})}
                value= {this.state.accountNumber}
			/> */}
                        <TextInputMask
                          refInput={ref => (this.accountNumber = ref)}
                          underlineColorAndroid="transparent"
                          placeholder="เลขที่บัญชี"
                          placeholderTextColor="#626262"
                          keyboardType="numeric"
                          returnKeyType="done"
                          maxLength={13}
                          // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                          // ref = {(input) => this.place = input}
                          onSubmitEditing={() => this.name.focus()}
                          type={"custom"}
                          options={{
                            mask: "999-9-99999-9"
                          }}
                          style={styles.textheaderinput}
                          onChangeText={accountNumber =>
                            this.setState({ accountNumber })
                          }
                          value={this.state.accountNumber}
                        />
                      </View>
                    </View>
                  </View>

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
                            name="user1"
                            size={17}
                            color="#626262"
                            style={{ paddingTop: 2, alignSelf: "center" }}
                          />
                        </View>
                        <TextInput
                          ref={input => (this.name = input)}
                          underlineColorAndroid="transparent"
                          placeholder="ชื่อเจ้าของบัญชี"
                          placeholderTextColor="#626262"
                          returnKeyType="next"
                          // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                          // ref = {(input) => this.place = input}
                          onSubmitEditing={() =>
                            this.setState({
                              chooseBankAccount: true
                            })
                          }
                          style={styles.textheaderinput}
                          onChangeText={name => this.setState({ name })}
                          value={this.state.name}
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
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            chooseBankAccount: true
                          });
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: "#eae5e5",
                            borderRadius: 10
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {this.renderBankaccountLogoforTextInput(
                              this.state.bank
                            )}
                            <Text
                              style={
                                this.state.bank != "ธนาคาร"
                                  ? [styles.textBankwithIcon, { color: "#000" }]
                                  : styles.textBankwithIcon
                              }
                            >
                              {this.state.bank}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
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
                          placeholder="สาขา"
                          placeholderTextColor="#626262"
                          onChangeText={branch => this.setState({ branch })}
                          ref={input => (this.branch = input)}
                          value={this.state.branch}
                        />
                      </View>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginTop: windowHeight * 0.05,
                      fontFamily: Fonts.MosseThai_Medium,
                      fontSize: 15,
                      color: "#c62333"
                    }}
                  >
                    ระบบจะตรวจสอบและบันทึกให้ภายใน 48 ชั่วโมง
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.addBankaccounttoFirebase(
                        accountNumber,
                        name,
                        bank,
                        branch
                      )
                    }
                    style={{
                      backgroundColor: "#F5A623",
                      paddingHorizontal: 25,
                      paddingVertical: 15,
                      marginTop: 5,
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
                      เพิ่มบัญชีธนาคาร
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.container}>
              <View style={{ flex: 1.5 }}>
                <View style={styles.eachviewContent}>
                  <Text style={styles.textHeader}>บัญชีรับเงินถอน</Text>
                </View>
              </View>
              <View style={{ flex: 12, justifyContent: "space-between" }}>
                <View
                  style={{ padding: windowWidth * 0.05, alignItems: "center" }}
                >
                  <View style={{ flexDirection: "row" }}>
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
                            name="book"
                            size={17}
                            color="#626262"
                            style={{ paddingTop: 2, alignSelf: "center" }}
                          />
                        </View>
                        {/* <TextInput
				ref={(input) => this.accountNumber = input}
                underlineColorAndroid='transparent'
                placeholder = "เลขที่บัญชี"
                placeholderTextColor = "#626262"
                returnKeyType = "next"
                // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                // ref = {(input) => this.place = input}
                onSubmitEditing = {() => this.name.focus()}
                style = {styles.textheaderinput}
                onChangeText={(accountNumber) => this.setState({accountNumber})}
                value= {this.state.accountNumber}
			/> */}
                        <TextInputMask
                          refInput={ref => (this.accountNumber = ref)}
                          underlineColorAndroid="transparent"
                          placeholder="เลขที่บัญชี"
                          placeholderTextColor="#626262"
                          keyboardType="numeric"
                          returnKeyType="done"
                          maxLength={13}
                          // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                          // ref = {(input) => this.place = input}
                          onSubmitEditing={() => this.name.focus()}
                          type={"custom"}
                          options={{
                            mask: "999-9-99999-9"
                          }}
                          style={styles.textheaderinput}
                          onChangeText={accountNumber =>
                            this.setState({ accountNumber })
                          }
                          value={this.state.accountNumber}
                        />
                      </View>
                    </View>
                  </View>

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
                            name="user1"
                            size={17}
                            color="#626262"
                            style={{ paddingTop: 2, alignSelf: "center" }}
                          />
                        </View>
                        <TextInput
                          ref={input => (this.name = input)}
                          underlineColorAndroid="transparent"
                          placeholder="ชื่อเจ้าของบัญชี"
                          placeholderTextColor="#626262"
                          returnKeyType="next"
                          // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                          // ref = {(input) => this.place = input}
                          onSubmitEditing={() =>
                            this.setState({
                              chooseBankAccount: true
                            })
                          }
                          style={styles.textheaderinput}
                          onChangeText={name => this.setState({ name })}
                          value={this.state.name}
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
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            chooseBankAccount: true
                          });
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            borderWidth: 1,
                            borderColor: "#eae5e5",
                            borderRadius: 10
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {this.renderBankaccountLogoforTextInput(
                              this.state.bank
                            )}
                            <Text
                              style={
                                this.state.bank != "ธนาคาร"
                                  ? [styles.textBankwithIcon, { color: "#000" }]
                                  : styles.textBankwithIcon
                              }
                            >
                              {this.state.bank}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
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
                          placeholder="สาขา"
                          placeholderTextColor="#626262"
                          onChangeText={branch => this.setState({ branch })}
                          ref={input => (this.branch = input)}
                          value={this.state.branch}
                        />
                      </View>
                    </View>
                  </View>

                  <Text
                    style={{
                      marginTop: windowHeight * 0.05,
                      fontFamily: Fonts.MosseThai_Medium,
                      fontSize: 15,
                      color: "#c62333"
                    }}
                  >
                    ระบบจะตรวจสอบและบันทึกให้ภายใน 48 ชั่วโมง
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.addBankaccounttoFirebase(
                        accountNumber,
                        name,
                        bank,
                        branch
                      )
                    }
                    style={{
                      backgroundColor: "#F5A623",
                      paddingHorizontal: 25,
                      paddingVertical: 15,
                      marginTop: 5,
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
                      เพิ่มบัญชีธนาคาร
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
        <AwesomeAlert
          show={showAlertaddCard}
          showProgress={false}
          title="สำเร็จ !"
          message="การเพิ่มบัญชีรับเงินถอนของคุณสำเร็จ"
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

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6"
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
  textgoback: {
    fontFamily: Fonts.MosseThai_Medium,
    color: "#626262",
    fontSize: 15
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
  BankaccountImage: {
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    borderRadius: (windowWidth * 0.1) / 2
  },
  BankaccountImage2: {
    width: 25,
    height: 25,
    borderRadius: 90
  },
  BankaccountImageView: {
    backgroundColor: "#fff",
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    borderRadius: (windowWidth * 0.1) / 2
  },
  BankaccountImageView2: {
    backgroundColor: "#fff",
    width: 25,
    height: 25,
    borderRadius: 90
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
  chooseProvinceview: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6"
    // marginVertical: windowWidth * 0.2,
    // marginHorizontal: windowWidth * 0.05
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent"
  },
  textBankwithIcon: {
    color: "#626262",
    fontFamily: Fonts.MosseThai_Medium,
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 5
  }
});
