import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  SafeAreaView,
  CameraRoll
} from "react-native";
import { Fonts } from "../../utill/Fonts";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import LinearGradient from "react-native-linear-gradient";
import IcoMoonConfig from "../../selection.json";
import FastImage from "react-native-fast-image";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import firebase from "@firebase/app";
import RNFetchBlob from "rn-fetch-blob";
import AwesomeAlert from "react-native-awesome-alerts";
import ImageBackground from "../styles/ImageBackground";
import Permissions from "react-native-permissions";

class CustomToolbarwithNav extends Component {
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
                  style={styles.icon}
                />
              </TouchableOpacity>

              <Text style={styles.toolbarTitle}>{this.props.title}</Text>
              <View style={styles.toolbarBellimage}>
                <Icon name="bell" size={15} color="#fff" />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}

export default class NoticationInfoScreen extends Component {
  static navigationOptions = () => {
    return {
      header: <View />
    };
  };

  constructor() {
    super();
    this.state = {
      loading: true,
      userProfileCurrent: {
        Name: null
      },
      userProfile: {},
      HistoryData: {},
      showAlertDownloadphoto: false
    };
  }

  componentDidMount() {
    this._requestPermission("camera");
    this._requestPermission("photo");

    const HistoryId = this.props.navigation.getParam("HistoryId");
    const type = this.props.navigation.getParam("type");
    const userId = firebase.auth().currentUser.uid;
    this.getuserinformationCurrent(userId);
    this.getHistoryInformation(HistoryId, type);
  }

  _openSettings = () => {
    Permissions.openSettings();
  };

  _requestPermission = permission => {
    var options;

    if (permission == "location") {
      options = this.state.isAlways ? "always" : "whenInUse";
    }

    Permissions.request(permission, options)
      .then(res => {
        this.setState({
          status: { ...this.state.status, [permission]: res }
        });
        console.log(res);
        if (res != "authorized") {
          console.log(res);
          var buttons = [{ text: "Cancel", style: "cancel" }];
          buttons.push({
            text: "Open Settings",
            onPress: this._openSettings
          });

          Alert.alert(
            "Whoops!",
            "There was a problem getting your permission. Please enable it from settings.",
            buttons
          );
        } else {
        }
      })
      .catch(() => {
        this._openSettings;
      });
  };

  getuserinformationCurrent = userId => {
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .on("value", snapshot => {
        let UserdetailProfile = {};
        UserdetailProfile.point = snapshot.child("Point").val();
        this.setState({
          userProfileCurrent: UserdetailProfile
        });
      });
  };

  getHistoryInformation = (HistoryId, type) => {
    const userId = firebase.auth().currentUser.uid;
    if (type == "cartPhoto") {
      firebase
        .database()
        .ref(`History/${userId}/Point/${HistoryId}`)
        .on("value", dataSnapshot => {
          let History = {};

          History.HistoryId = dataSnapshot.key;
          History.DateTime = dataSnapshot.child("DateTime").val();
          History.Point = dataSnapshot.child("Point").val();
          History.eventName = dataSnapshot.child("eventName").val();
          History.bib = dataSnapshot.child("bib").val();
          History.photoId = dataSnapshot.child("photoId").val();
          History.photographerId = dataSnapshot.child("photographerId").val();

          firebase
            .database()
            .ref(`User/Detail/${dataSnapshot.child("photographerId").val()}`)
            .on("value", snapshot => {
              let Photographerprofile = {};
              Photographerprofile.name = snapshot.child("Name").val();
              Photographerprofile.imageprofileuri = snapshot
                .child("PhotoURL")
                .val();
              this.setState({
                userProfile: Photographerprofile,
                loading: false,
                HistoryData: History
              });
            });
        });
    } else if (type == "soldPhoto") {
      firebase
        .database()
        .ref(`History/${userId}/Sold/${HistoryId}`)
        .on("value", dataSnapshot => {
          let History = {};

          History.HistoryId = dataSnapshot.key;
          History.eventName = dataSnapshot.child("eventName").val();
          History.bib = dataSnapshot.child("bib").val();
          History.photoId = dataSnapshot.child("photoId").val();
          History.buyerId = dataSnapshot.child("buyerId").val();

          firebase
            .database()
            .ref(`User/Detail/${dataSnapshot.child("buyerId").val()}`)
            .on("value", snapshot => {
              let Photographerprofile = {};
              Photographerprofile.name = snapshot.child("Name").val();
              Photographerprofile.imageprofileuri = snapshot
                .child("PhotoURL")
                .val();
              this.setState({
                userProfile: Photographerprofile,
                loading: false,
                HistoryData: History
              });
            });
        });
    } else if (type == "cartPoint") {
      firebase
        .database()
        .ref(`History/${userId}/Point/${HistoryId}`)
        .on("value", dataSnapshot => {
          let History = {};

          History.HistoryId = dataSnapshot.key;
          History.DateTime = dataSnapshot.child("DateTime").val();
          History.Point = dataSnapshot.child("Point").val();
          History.type = dataSnapshot.child("type").val();

          this.setState({
            loading: false,
            HistoryData: History
          });
        });
    }
  };

  saveToStorage = (Imageuri) => {
    this.setState({loading: true})
    CameraRoll.saveToCameraRoll(Imageuri, 'photo').then(() =>{
      this.showAwesomeAlertDownloadphoto()
    }).catch((error) => {
      Alert.alert('',error.toString(), [{text: 'OK'}], { cancelable: false });
  })
  }

  showAwesomeAlertDownloadphoto = () => {
    this.setState({
      loading: false,
      showAlertDownloadphoto: true
    });
  };

  AcceptAwesomeAlertDownloadphoto = () => {
    this.setState({
      showAlertDownloadphoto: false
    });
  };

  render() {
    const type = this.props.navigation.getParam("type");
    const Imageuri = this.props.navigation.getParam("Imageuri");
    const { showAlertDownloadphoto } = this.state;

    if (type == "cartPoint") {
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
          <CustomToolbarwithNav
            title={this.props.navigation.getParam("title", "Refill Point")}
            onBackpress={() => {
              this.props.navigation.pop(1);
            }}
          />
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
            title={this.props.navigation.getParam("title", "Refill Point")}
            onBackpress={() => {
              this.props.navigation.pop(1);
            }}
          />
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
                  แต้มของคุณเพิ่มขึ้น
                </Text>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
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
                    {this.state.HistoryData.Point}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (type == "soldPhoto") {
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
          <CustomToolbarwithNav
            title={this.props.navigation.getParam("title", "Sold Photo")}
            onBackpress={() => {
              this.props.navigation.pop(1);
            }}
          />
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator animating={this.state.loading} size={50} />
              </View>
            </View>
          </Modal>

          <View style={styles.container}>
            <ImageBackground
              style={{
                flex: 6,
                width: null,
                height: null,
                alignItems: "center",
                justifyContent: "center"
              }}
              onLoadEnd={() => {
                this.setState({ loading: false });
              }}
              source={{ uri: Imageuri }}
            >
              <ActivityIndicator
                animating={this.state.loading}
                size="small"
                color="#000"
              />
              {this.state.loading == false ? (
                <View>
                  <Text style={styles.textimagebackground}>SAMPLE PHOTO</Text>
                  <Text style={[styles.textimagebackground, { fontSize: 30 }]}>
                    by PhoMe
                  </Text>
                </View>
              ) : null}
            </ImageBackground>

            <View style={{ flex: 2.5 }}>
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: windowWidth * 0.05,
                  paddingVertical: windowWidth * 0.02
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <View>
                    <Text style={styles.textHeader}>ผู้ซื้อภาพ</Text>
                    <Text
                      style={{
                        fontSize: 17,
                        fontFamily: Fonts.MosseThai_Regular,
                        color: "#000"
                      }}
                    >
                      {this.state.userProfile.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Icon
                          name="tag"
                          color="#000"
                          size={14}
                          style={{ marginRight: 5, paddingTop: 2 }}
                        />
                        <Text style={styles.tagText}>BIB</Text>
                        {/* <Text style = {[styles.tagText, {fontFamily: Fonts.MosseThai_Bold}]}>{bib}</Text> */}
                        <Text
                          style={[
                            styles.tagText,
                            { fontFamily: Fonts.MosseThai_Bold }
                          ]}
                        >
                          {this.state.HistoryData.bib}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          marginLeft: 20,
                          alignItems: "center"
                        }}
                      >
                        <Icon
                          name="tag"
                          color="#000"
                          size={14}
                          style={{ marginRight: 5, paddingTop: 2 }}
                        />
                        {/* <Text style = {[styles.tagText, {fontFamily: Fonts.MosseThai_Bold}]}>{Eventname}</Text> */}
                        <Text
                          style={[
                            styles.tagText,
                            { fontFamily: Fonts.MosseThai_Bold }
                          ]}
                        >
                          {this.state.HistoryData.eventName}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <FastImage
                    source={{ uri: this.state.userProfile.imageprofileuri }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (type == "cartPhoto") {
      return (
        <View style={styles.container}>
          <Modal
            animationType={"none"}
            visible={this.state.loading}
            onRequestClose={() => {
              console.log("close modal");
            }}
          >
          <CustomToolbarwithNav
                title={this.props.navigation.getParam("title", "Bought Photo")}
              />
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
            title={this.props.navigation.getParam("title", "Bought Photo")}
            onBackpress={() => {
              this.props.navigation.pop(1);
            }}
          />

          <View
            style={{ flex: 6.8, borderBottomWidth: 1, borderColor: "#eae5e5" }}
          >
            <View
              style={{
                flex: 1.2,
                borderBottomWidth: 1,
                borderColor: "#eae5e5",
                padding: windowWidth * 0.05
              }}
            >
              <Text style={styles.textHeader}>สรุปการซื้อภาพ</Text>
            </View>

            <View
              style={{
                flex: 4.7,
                borderBottomWidth: 1,
                borderColor: "#eae5e5",
                padding: windowWidth * 0.05
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <FastImage
                  source={{ uri: Imageuri }}
                  resizeMode="cover"
                  style={{ flex: 3.5 }}
                />
                <View style={{ flex: 5.3, paddingLeft: 15 }}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <View>
                        <Text
                          style={[
                            styles.textHeader,
                            {
                              fontFamily: Fonts.MosseThai_Regular,
                              fontSize: 18,
                              color: "#000"
                            }
                          ]}
                        >
                          {this.state.userProfile.name}
                        </Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Icon
                            name="tag"
                            color="#000"
                            size={14}
                            style={{ marginRight: 5, paddingTop: 2 }}
                          />
                          <Text
                            style={[
                              styles.tagText,
                              { fontFamily: Fonts.MosseThai_Bold }
                            ]}
                          >
                            {this.state.HistoryData.eventName}
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Icon
                            name="tag"
                            color="#000"
                            size={14}
                            style={{ marginRight: 5, paddingTop: 2 }}
                          />
                          <Text style={styles.tagText}>BIB</Text>
                          <Text
                            style={[
                              styles.tagText,
                              { fontFamily: Fonts.MosseThai_Bold }
                            ]}
                          >
                            {this.state.HistoryData.bib}
                          </Text>
                        </View>
                      </View>

                      <FastImage
                        source={{ uri: this.state.userProfile.imageprofileuri }}
                        style={{
                          width: windowWidth * 0.09,
                          height: windowWidth * 0.09,
                          borderRadius: (windowWidth * 0.09) / 2,
                          marginTop: 2
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  </View>

                  <View style={{ flex: 0.2 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={[styles.texttitle, { paddingHorizontal: 5 }]}
                      >
                        ภาพนี้ใช้ จำนวนแต้ม:
                      </Text>
                      <Icon
                        name="coffee"
                        size={17}
                        color="#F5A623"
                        style={{ paddingHorizontal: 5 }}
                      />
                      <Text
                        style={[
                          styles.textHeader,
                          { paddingHorizontal: 5, fontSize: 20 }
                        ]}
                      >
                        {this.state.HistoryData.Point}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ flex: 5 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 15,
                alignItems: "center"
              }}
            >
              <Text style={[styles.textHeader, { paddingHorizontal: 5 }]}>
                My Points:
              </Text>
              <Icon
                name="coffee"
                size={30}
                color="#F5A623"
                style={{ paddingHorizontal: 5 }}
              />
              <Text
                style={[
                  styles.textHeader,
                  { paddingHorizontal: 5, fontSize: 30 }
                ]}
              >
                {"" + this.state.userProfileCurrent.point}
              </Text>
            </View>

            <View style={{ marginTop: 30 }}>
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  borderColor: "#F5A623",
                  borderWidth: 2,
                  borderRadius: 35
                }}
                onPress={() =>
                  this.props.navigation.push("refillPoints", { Eventname: "" })
                }
              >
                <Text style={[styles.textHeader, { color: "#F5A623" }]}>
                  + เติมแต้ม
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 5 }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 15,
                  justifyContent: "space-around"
                }}
              >
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.saveToStorage(
                        Imageuri,
                        this.state.HistoryData.bib,
                        this.state.HistoryData.eventName
                      );
                    }}
                  >
                    <View
                      style={{
                        width: windowWidth * 0.205,
                        height: windowWidth * 0.2,
                        borderRadius: (windowWidth * 0.2) / 2,
                        marginBottom: 10
                      }}
                    >
                      <LinearGradient
                        colors={["#fad961", "#f76b1c"]}
                        style={{
                          flex: 1,
                          borderRadius: (windowWidth * 0.2) / 2,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Icon
                          name="arrow-to-bottom2"
                          size={31}
                          color="#fff"
                          style={{ paddingTop: 2 }}
                        />
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.textEditor}>Camera</Text>
                  <Text style={styles.textEditor}>Roll</Text>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.push("PhotoEditor", {
                        Eventname: this.state.HistoryData.eventName,
                        uri: Imageuri,
                        bib: this.state.HistoryData.bib,
                        hideTabBar: true
                      })
                    }
                  >
                    <View
                      style={{
                        width: windowWidth * 0.205,
                        height: windowWidth * 0.2,
                        borderRadius: (windowWidth * 0.2) / 2,
                        marginBottom: 10
                      }}
                    >
                      <LinearGradient
                        colors={["#fad961", "#f76b1c"]}
                        style={{
                          flex: 1,
                          borderRadius: (windowWidth * 0.2) / 2,
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Icon
                          name="magic2"
                          size={30}
                          color="#fff"
                          style={{ paddingTop: 2 }}
                        />
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.textEditor}>Photo</Text>
                  <Text style={styles.textEditor}>Editor</Text>
                </View>
              </View>
            </View>
          </View>

          <AwesomeAlert
            show={showAlertDownloadphoto}
            showProgress={false}
            title="สำเร็จ !"
            message="การดาวน์โหลดรูปภาพของคุณเสร็จสิ้นแล้ว"
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
              this.AcceptAwesomeAlertDownloadphoto();
            }}
          />
        </View>
      );
    }
  }
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6"
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
    backgroundColor: "#626262",
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center'
  },
  activityIndicatorWrapper: {
    backgroundColor: "transparent"
  },
  textHeader: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 18,
    color: "#5a5a5a"
  },
  texttitle: {
    fontFamily: Fonts.MosseThai_Regular,
    fontSize: 16,
    color: "#5a5a5a"
  },
  profileImage: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.1475,
    borderRadius: (windowWidth * 0.15) / 2,
    marginTop: 10,
    marginRight: 10
  },
  tagText: {
    fontFamily: Fonts.MosseThai_Regular,
    color: "#000",
    fontSize: 15,
    paddingLeft: 5
  },
  textimagebackground: {
    transform: [{ rotate: "325deg" }],
    fontSize: 40,
    textAlign: "center",
    fontFamily: Fonts.MosseThai_Bold,
    color: "rgba(0, 0, 255, 0.65)"
  },
  textEditor: {
    textAlign: "center",
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 15,
    color: "#5a5a5a",
    lineHeight: 18
  },
  textHeader: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 20,
    color: "#5a5a5a"
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
  textconfirm: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 14,
    color: "#5a5a5a"
  }
});
