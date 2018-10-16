import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  BackHandler,
  Modal,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  CameraRoll
} from "react-native";
import CustomToolbarwithNav from "../styles/CustomToolbarwithNav";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import { Fonts } from "../../utill/Fonts";
import LinearGradient from "react-native-linear-gradient";
import RNFetchBlob from "rn-fetch-blob";
import firebase from "@firebase/app";
import AwesomeAlert from "react-native-awesome-alerts";
import FastImage from "react-native-fast-image";
import Permissions from "react-native-permissions";
import moment from "moment";

var Photographerprofile = {
  name: null,
  imageprofileuri: null,
  id: null
};

export default class ImageinfoScreen extends Component {
  static navigationOptions = () => {
    return {
      header: <View />
    };
  };

  constructor() {
    super();
    this.state = {
      resultpage: false,
      succespage: false,
      selectpage: true,
      loading: true,
      showAlert: false,
      showAlertDownloadphoto: false,
      loadingConfirm: false,
      userProfileCurrent: {
        Name: null,
        Point: null
      }
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    const photographer = this.props.navigation.getParam("photographer");
    const userId = firebase.auth().currentUser.uid;
    this.getuserinformationCurrent(userId);
    this.getProtographerdetail(photographer);

    this._requestPermission("camera");
    this._requestPermission("photo");
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

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }

  handleBackPress = () => {
    return true;
  };

  getuserinformationCurrent = userId => {
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .on("value", snapshot => {
        let UserdetailProfile = {};
        UserdetailProfile.name = snapshot.child("Name").val();
        UserdetailProfile.point = snapshot.child("Point").val();

        this.setState({
          userProfileCurrent: UserdetailProfile
        });
      });
  };

  getProtographerdetail = photographer => {
    firebase
      .database()
      .ref(`User/Detail/${photographer}`)
      .on("value", snapshot => {
        Photographerprofile.name = snapshot.child("Name").val();
        Photographerprofile.imageprofileuri = snapshot.child("PhotoURL").val();
        Photographerprofile.id = photographer;

        this.setState({
          userProfile: Photographerprofile,
          loading: false
        });
      });
  };

  openResultPage = () => {
    this.setState({
      selectpage: false,
      succespage: false,
      resultpage: true
    });
  };

  openSelectPage = () => {
    this.setState({
      selectpage: true,
      resultpage: false
    });
  };

  saveToStorage = (Imageuri, bib, Eventname) => {
    this.setState({ loadingConfirm: true });
    CameraRoll.saveToCameraRoll(Imageuri, "photo")
      .then(() => {
        this.showAwesomeAlertDownloadphoto();
      })
      .catch(error => {
        Alert.alert("", error.toString(), [{ text: "OK" }], {
          cancelable: false
        });
      });
    // let dirs = RNFetchBlob.fs.dirs
    // var date = new Date().toLocaleString({ timeZone: 'Asia' })
    // RNFetchBlob.config({
    //   path : dirs.DownloadDir + '/Phome/'+Eventname+'_'+bib+'_'+date+'.jpg',
    //   addAndroidDownloads : {
    //     title : Eventname+'_'+bib+'_'+date+'.jpg',
    //     description : 'Download is finish ! please check your image at '+dirs.DownloadDir + '/Phome/'+Eventname+'_'+bib+'.jpg',
    //     mime : 'image/jpg',
    //     mediaScannable : true,
    //     notification : true,
    //   }
    // })
    // .fetch('GET', Imageuri)
    // .then((res) => {
    //   this.showAwesomeAlertDownloadphoto()
    // })
  };

  showAwesomeAlert = () => {
    this.setState({
      showAlert: true,
      succespage: true,
      resultpage: false,
      loading: false
    });
  };

  showAwesomeAlertDownloadphoto = () => {
    this.setState({
      showAlertDownloadphoto: true,
      loadingConfirm: false
    });
  };

  AcceptAwesomeAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  AcceptAwesomeAlertDownloadphoto = () => {
    this.setState({
      showAlertDownloadphoto: false
    });
  };

  openSuccesspage = (Eventname, PhotoId, bib, Imageuri, photographer) => {
    if (this.state.userProfileCurrent.point > 0) {
      this.setState({ loading: true });
      const userId = firebase.auth().currentUser.uid;
      firebase
        .database()
        .ref("User/Detail")
        .child(`${userId}`)
        .update({
          Point: this.state.userProfileCurrent.point - 1
        });
      firebase
        .database()
        .ref(`User/Photo/${userId}/Bought/${Eventname}`)
        .child(`${PhotoId}`)
        .set({
          bib: bib,
          uri: Imageuri
        });
      firebase
        .database()
        .ref(`User/Photo/${photographer}/Sold/${Eventname}/${userId}`)
        .child(`${PhotoId}`)
        .set({
          bib: bib,
          uri: Imageuri
        });
      firebase
        .database()
        .ref(`History/${photographer}/Sold`)
        .push({
          bib: bib,
          uri: Imageuri,
          PhotoId: PhotoId,
          eventName: Eventname,
          buyerId: userId
        })
        .then(snapshot => {
          firebase
            .database()
            .ref(`Notification/${photographer}`)
            .push({
              HistoryId: snapshot.key,
              read: false,
              date: moment(date).format('l')+' '+moment(date).format('HH:mm:ss'), 
              type: "soldPhoto",
              title: Eventname,
              Imageuri: Imageuri
            });
        });
      let date = new Date();
      firebase
        .database()
        .ref(`History/${userId}/Point`)
        .push({
          Point: 1,
          DateTime: moment(date).format('HH:mm:ss')+'. '+moment(date).format('l'),
          type: "Used",
          detail: "Bought photo",
          eventName: Eventname,
          photoId: PhotoId,
          photographerId: photographer,
          bib: bib
        })
        .then(snapshot => {
          firebase
            .database()
            .ref(`Notification/${userId}`)
            .push({
              HistoryId: snapshot.key,
              read: false,
              date: moment(date).format('l')+' '+moment(date).format('HH:mm:ss'),
              type: "cartPhoto",
              title: Eventname,
              Imageuri: Imageuri
            });
          this.showAwesomeAlert();
        });
    } else {
      Alert.alert(
        "ซื้อภาพไม่สำเร็จ",
        "จำนวนแต้มของคุณไม่พอที่จะซื้อรูปนี้",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  };

  render() {
    const Eventname = this.props.navigation.getParam("Eventname");
    const Imageuri = this.props.navigation.getParam("uri");
    const bib = this.props.navigation.getParam("bib");
    const PhotoId = this.props.navigation.getParam("key");
    const photographer = this.props.navigation.getParam("photographer");
    const { showAlert, showAlertDownloadphoto } = this.state;

    return (
      <View style={styles.container}>
        {this.state.selectpage ? (
          <CustomToolbarwithNav
            title={this.props.navigation.getParam("title", Eventname)}
            onBackpress={() => {
              this.props.navigation.pop(1);
            }}
            onBellpress={() => {
              this.props.navigation.push("notification");
            }}
          />
        ) : null}
        {this.state.resultpage ? (
          <CustomToolbarwithNav
            title={this.props.navigation.getParam("title", Eventname)}
            onBackpress={this.openSelectPage}
            onBellpress={() => {
              this.props.navigation.push("notification");
            }}
          />
        ) : null}
        {this.state.succespage ? (
          <CustomToolbarwithNav
            title={this.props.navigation.getParam("title", Eventname)}
            onBackpress={() => {
              this.props.navigation.pop(1);
            }}
            onBellpress={() => {
              this.props.navigation.push("notification");
            }}
          />
        ) : null}
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
                <ActivityIndicator
                  animating={this.state.loading}
                  size="small"
                  color="#000"
                />
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            animationType={"none"}
            visible={this.state.loadingConfirm}
            onRequestClose={() => {
              console.log("close modal");
            }}
          >
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={this.state.loadingConfirm}
                  size="large"
                  color="#000"
                />
              </View>
            </View>
          </Modal>
          {this.state.selectpage ? (
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
                    <Text
                      style={[styles.textimagebackground, { fontSize: 30 }]}
                    >
                      by PhoMe
                    </Text>
                  </View>
                ) : null}
              </ImageBackground>

              <View style={{ flex: 4.5 }}>
                <View
                  style={{
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: "#eae5e5",
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
                    <Text style={[styles.textHeader, { alignSelf: "center" }]}>
                      ผู้ถ่ายภาพ
                    </Text>
                    <TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center"
                        }}
                      >
                        <Icon
                          name="flag"
                          size={11}
                          style={{ alignSelf: "center" }}
                        />
                        <Text
                          style={{
                            paddingLeft: 10,
                            fontFamily: Fonts.MosseThai_Regular,
                            fontSize: 12,
                            alignSelf: "center"
                          }}
                        >
                          Report this photo
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flex: 2,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingBottom: 10,
                      paddingHorizontal: 5
                    }}
                  >
                    <View style={{ flex: 2 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: Fonts.MosseThai_Regular,
                          color: "#000"
                        }}
                      >
                        {Photographerprofile.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.push("userprofile", {
                            photographer: Photographerprofile.id
                          })
                        }
                        style={{
                          backgroundColor: "#F5A623",
                          paddingHorizontal: 15,
                          paddingVertical: 5,
                          alignSelf: "flex-start",
                          marginTop: 5,
                          borderRadius: 15
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: Fonts.MosseThai_Medium,
                            color: "#fff"
                          }}
                        >
                          View Profile
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {Photographerprofile.imageprofileuri != null ? (
                      <FastImage
                        source={{ uri: Photographerprofile.imageprofileuri }}
                        style={styles.profileImage}
                        resizeMode="cover"
                      />
                    ) : null}
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: windowWidth * 0.075,
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
                      <Text
                        style={[
                          styles.tagText,
                          { fontFamily: Fonts.MosseThai_Bold }
                        ]}
                      >
                        {bib}
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
                      <Text
                        style={[
                          styles.tagText,
                          { fontFamily: Fonts.MosseThai_Bold }
                        ]}
                      >
                        {Eventname}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        marginHorizontal: windowWidth * 0.025,
                        marginBottom: 15,
                        justifyContent: "center"
                      }}
                      onPress={this.openResultPage}
                    >
                      <LinearGradient
                        colors={["#fad961", "#f76b1c"]}
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          borderRadius: 10
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
                          SELECT THIS PHOTO
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.resultpage ? (
            <View style={styles.container}>
              <View
                style={{
                  flex: 6.8,
                  borderBottomWidth: 1,
                  borderColor: "#eae5e5"
                }}
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
                              {Photographerprofile.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center"
                              }}
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
                                {Eventname}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
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
                              <Text
                                style={[
                                  styles.tagText,
                                  { fontFamily: Fonts.MosseThai_Bold }
                                ]}
                              >
                                {bib}
                              </Text>
                            </View>
                          </View>

                          {Photographerprofile.imageprofileuri != null ? (
                            <FastImage
                              source={{
                                uri: Photographerprofile.imageprofileuri
                              }}
                              style={{
                                width: windowWidth * 0.09,
                                height: windowWidth * 0.09,
                                borderRadius: (windowWidth * 0.09) / 2,
                                marginTop: 2
                              }}
                              resizeMode="cover"
                            />
                          ) : null}
                        </View>
                      </View>

                      <View style={{ flex: 0.2 }}>
                        <View
                          style={{ flexDirection: "row", alignItems: "baseline", justifyContent: 'center' }}
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
                              { paddingHorizontal: 5, fontSize: 16 }
                            ]}
                          >
                            1
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ flex: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingTop: 15,
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
                      this.props.navigation.push("refillPoints", {
                        Eventname: Eventname
                      })
                    }
                  >
                    <Text style={[styles.textHeader, { color: "#F5A623" }]}>
                      + เติมแต้ม
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.MosseThai_Bold,
                      alignSelf: "center",
                      fontSize: 15,
                      color: "#000",
                      paddingVertical: 15
                    }}
                  >
                    หลังจากกดปุ่มคอนเฟิร์ม ระบบจะหักแต้มทันที
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginHorizontal: windowWidth * 0.025,
                      marginBottom: 15
                    }}
                    onPress={() =>
                      this.openSuccesspage(
                        Eventname,
                        PhotoId,
                        bib,
                        Imageuri,
                        photographer
                      )
                    }
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
                        CONFIRM
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}

          {this.state.succespage ? (
            <View style={styles.container}>
              <View
                style={{
                  flex: 6.8,
                  borderBottomWidth: 1,
                  borderColor: "#eae5e5"
                }}
              >
                <View
                  style={{
                    flex: 1.2,
                    borderBottomWidth: 1,
                    borderColor: "#eae5e5",
                    padding: windowWidth * 0.05
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text style={[styles.textHeader, { color: "#F5A623" }]}>
                      ยินดีด้วย{" "}
                    </Text>
                    <Text style={styles.textHeader}>การซื้อภาพสำเร็จแล้ว</Text>
                  </View>
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
                    <Image
                      source={{ uri: Imageuri }}
                      resizeMode="cover"
                      style={{ flex: 3.5 }}
                    />
                    <View style={{ flex: 5.3, paddingLeft: 15 }}>
                      <View style={{ flex: 1 }}>
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
                            Order Summary
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              borderBottomWidth: 1,
                              borderColor: "#eae5e5",
                              marginLeft: windowWidth * 0.05,
                              marginRight: windowWidth * 0.1
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                color: "#000",
                                fontFamily: Fonts.MosseThai_Regular,
                                color: "#000"
                              }}
                            >
                              เดิม
                            </Text>
                            <View>
                              <Text
                                style={[
                                  styles.tagText,
                                  {
                                    fontFamily: Fonts.MosseThai_Bold,
                                    fontSize: 17,
                                    alignSelf: "flex-end"
                                  }
                                ]}
                              >
                                {this.state.userProfileCurrent.point + 1}
                              </Text>
                              <Text
                                style={[
                                  styles.tagText,
                                  {
                                    fontFamily: Fonts.MosseThai_Bold,
                                    fontSize: 17,
                                    lineHeight: 20
                                  }
                                ]}
                              >
                                -1
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              borderBottomWidth: 1,
                              borderColor: "#eae5e5",
                              marginLeft: windowWidth * 0.05,
                              marginRight: windowWidth * 0.1
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottomWidth: 1,
                                borderColor: "#eae5e5",
                                marginBottom: 2
                              }}
                            >
                              <Text
                                style={[
                                  styles.tagText,
                                  { fontSize: 15, color: "#000" }
                                ]}
                              >
                                คงเหลือ
                              </Text>
                              <Text
                                style={[
                                  styles.tagText,
                                  {
                                    fontFamily: Fonts.MosseThai_Bold,
                                    fontSize: 19,
                                    alignSelf: "flex-end"
                                  }
                                ]}
                              >
                                {"" + this.state.userProfileCurrent.point}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ flex: 10 }}>
                <View style={{ flex: 6 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderBottomWidth: 1,
                      borderColor: "#eae5e5"
                    }}
                  >
                    <Text
                      style={[styles.textHeader, { paddingHorizontal: 10 }]}
                    >
                      My Remaining Points:
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

                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                        paddingHorizontal: 25,
                        justifyContent: "center",
                        borderColor: "#F5A623",
                        borderWidth: 2,
                        borderRadius: 35
                      }}
                      onPress={() =>
                        this.props.navigation.push("refillPoints", {
                          Eventname: Eventname
                        })
                      }
                    >
                      <Text style={[styles.textHeader, { color: "#F5A623" }]}>
                        + เติมแต้ม
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      marginBottom: 10,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={styles.textHeader}>ดาวน์โหลดรูปภาพ</Text>
                    <Text
                      style={{
                        fontFamily: Fonts.MosseThai_Medium,
                        color: "#a9abad",
                        fontSize: 14
                      }}
                    >
                      สามารถโหลดซ้ำใน Menu Profile ของคุณ
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 4 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: windowWidth * 0.035
                    }}
                  >
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.saveToStorage(Imageuri, bib, Eventname);
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

                    <View style={{ flex: 1, alignItems: "center" }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.push("PhotoEditor", {
                            Eventname: Eventname,
                            uri: Imageuri,
                            bib: bib,
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

                    {this.state.image != "" ? (
                      <FastImage source={this.state.image} />
                    ) : null}
                  </View>
                  {/* <TouchableOpacity style = {{marginHorizontal: windowWidth * 0.025, marginBottom: 15,}}>
      <LinearGradient
      colors={['#fad961', '#f76b1c']} style = {{flex: 1, justifyContent: 'center', borderRadius: 10, paddingVertical: windowWidth * 0.035}}>
        <Text style ={{fontFamily: Fonts.MosseThai_Bold, color: '#fff', fontSize: 21, alignSelf: 'center'}}>CONFIRM</Text>
      </LinearGradient>
      </TouchableOpacity> */}
                </View>
              </View>
            </View>
          ) : null}

          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="สำเร็จ !"
            message="การซื้อภาพสำเร็จ สามารถตรวจสอบรูปภาพได้ใน Menu Profile ของคุณ"
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
              color: "#2f3640",
              fontSize: 19
            }}
            confirmButtonTextStyle={{
              fontFamily: Fonts.MosseThai_Medium,
              textAlign: "center",
              color: "#fff",
              fontSize: 14
            }}
            onConfirmPressed={() => {
              this.AcceptAwesomeAlert();
            }}
          />

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
              color: "#2f3640",
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
