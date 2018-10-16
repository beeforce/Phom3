import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  TouchableHighlight,
  AsyncStorage,
  Modal,
  ActivityIndicator,
  Platform
} from "react-native";
import { Fonts } from "../../utill/Fonts";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import CustomToolbar from "../styles/CustomToolbar";
import FastImage from "react-native-fast-image";
import { TextMask } from "react-native-masked-text";
import firebase from "@firebase/app";
import RNFetchBlob from "rn-fetch-blob";
import AwesomeAlert from "react-native-awesome-alerts";

var ImagePicker = require("react-native-image-picker");

// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: "Select Avatar",
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

export default class Profile_CustomerScreen extends Component {
  static navigationOptions = () => {
    return {
      header: <View />
    };
  };

  constructor() {
    super();
    // this.photoPostRef = firebase.database().ref(`User/Photo/${userId}/Post`);
    this.state = {
      userImagePost: [],
      userImageBought: [],
      HistoryPointList: [],
      userinfo: {},
      pickImage: false,
      loading: true,
      activeIndex: 0,
      user: null,
      userName: "",
      showAlertawesomeprofile: false
    };
  }

  componentDidMount() {
    // user id from firebase
    const userId = firebase.auth().currentUser.uid;
    this.getUserdetail(userId);
    this.getHistoryPoint(userId);
    this.getImagePost(userId);
    this.getImageBought(userId);
    this.getuserinformationCurrent(userId);
  }

  // componentWillMount() {
  //   AsyncStorage.getItem('userData').then((user_data_json) => {
  //     let userData = JSON.parse(user_data_json);
  //     this.setState({
  //       user: userData,
  //     });
  //   });
  // }
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

  getUserdetail = userId => {
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .on("value", snapshot => {
        firebase
          .database()
          .ref(`User/Photo/${userId}/Bought`)
          .on("value", dataSnapshot => {
            let ImageList = [];
            let EventList = [];
            dataSnapshot.forEach(child => {
              child.forEach(eachchild => {
                ImageList.push({
                  _key: eachchild.key
                });
              });
            });
            firebase
              .database()
              .ref(`User/Photo/${userId}/Bought`)
              .on("value", dataSnapshot => {
                dataSnapshot.forEach(child => {
                  EventList.push({
                    title: child.key
                  });
                });
                let Userprofile = {};
                Userprofile.name = snapshot.child("Name").val();
                Userprofile.imageprofileuri = snapshot.child("PhotoURL").val();
                Userprofile.imagePost = ImageList.length;
                Userprofile.eventJoin = EventList.length;

                this.setState({
                  userinfo: Userprofile
                });
              });
          });

        // Userprofile.name = snapshot.child('Name').val()
        // Userprofile.imageprofileuri = snapshot.child('PhotoURL').val()

        // firebase.database().ref(`User/Photo/${userId}`).on('value', snapshot => {
        //   Userprofile.imagePost = snapshot.child('imagePost').val()
        //   Userprofile.eventJoin = snapshot.child('eventJoin').val()
        //   Userprofile.imagesoldout = ssnapshot.child('imagesoldout').val()

        // Userprofile.push({
        //   name: snapshot.child('Name').val(),
        //   imageprofileuri: snapshot.child('PhotoURL').val(),
        // });

        // })
      });
  };

  getHistoryPoint = userId => {
    firebase
      .database()
      .ref(`History/${userId}/Point`)
      .on("value", dataSnapshot => {
        let HistoryPointList = [];
        dataSnapshot.forEach(child => {
          HistoryPointList.push({
            _key: child.key,
            DateTime: child.val().DateTime,
            Point: child.val().Point,
            type: child.val().type
          });
        });
        console.log(HistoryPointList);
        this.setState({
          HistoryPointList: HistoryPointList.reverse()
        });
      });
  };

  getImagePost(userId) {
    firebase
      .database()
      .ref(`User/Detail/${userId}/Favorite`)
      .on("value", dataSnapshot => {
        let FavoriteEventList = [];
        dataSnapshot.forEach(child => {
          FavoriteEventList.push({
            _key: child.key
          });
        });
        firebase
          .database()
          .ref(`User/Photo/${userId}/Bought`)
          .on("value", dataSnapshot => {
            let imagelistBought = [];
            dataSnapshot.forEach(child => {
              child.forEach(eachchild => {
                imagelistBought.push({
                  _key: eachchild.key
                });
              });
            });

            firebase
          .database()
          .ref(`User/Photo/${userId}/Post`)
          .on("value", dataSnapshot => {
            let imagelistPost = [];
            dataSnapshot.forEach(child => {
              child.forEach(eachchild => {
                imagelistPost.push({
                  title: child.key,
                  uri: eachchild.val().uri,
                  bib: eachchild.val().bib,
                  photographer: eachchild.val().photoGrapherID,
                  _key: eachchild.key
                });
              });
            });

            let ImageList = [];
            FavoriteEventList.forEach(each => {
              firebase
                .database()
                .ref(`Photos/${each._key}`)
                .on("value", dataSnapshot => {
                  dataSnapshot.forEach(child => {
                    ImageList.push({
                      title: each._key,
                      uri: child.val().uri,
                      bib: child.val().bib,
                      photographer: child.val().photoGrapherID,
                      _key: child.key
                    });
                  });
                });
            });

            imagelistBought.forEach(each => {
              ImageList.forEach(child => {
                if (each._key == child._key) {
                  let i = ImageList.indexOf(child);
                  ImageList.splice(i, 1);
                }
              });
            });

            imagelistPost.forEach(each => {
              ImageList.forEach(child => {
                if (each._key == child._key) {
                  let i = ImageList.indexOf(child);
                  ImageList.splice(i, 1);
                }
              });
            });
            
            this.setState({
              userImagePost: ImageList
            });
          });
        });
      });
  }

  getImageBought(userId) {
    firebase
      .database()
      .ref(`User/Photo/${userId}/Bought`)
      .on("value", dataSnapshot => {
        let ImageList = [];
        dataSnapshot.forEach(child => {
          child.forEach(eachchild => {
            ImageList.push({
              title: child.key,
              uri: eachchild.val().uri,
              bib: eachchild.val().bib,
              photographer: eachchild.val().photoGrapherID,
              _key: eachchild.key
            });
          });
        });
        this.setState({
          userImageBought: ImageList,
          loading: false
        });
      });
  }

  imagePicker = () => {
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.uploadImage(response.uri);
        this.setState({
          avatarSource: source,
          pickImage: true
        });
      }
    });
  };

  uploadImage(uri, mime = "image/jpg") {
    const userId = firebase.auth().currentUser.uid;
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;
    this.setState({
      loading: true
    });
    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === "ios" ? uri.replace("file://", "") : uri;
      let uploadBlob = null;

      const imageRef = firebase
        .storage()
        .ref("images/profiles")
        .child(userId + "_ProfileImage.jpg");

      fs.readFile(uploadUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(url => {
          resolve(url);
          this.storeEventReference(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  storeEventReference = downloadUrl => {
    const userId = firebase.auth().currentUser.uid;
    let data = {
      PhotoURL: downloadUrl
    };
    firebase
      .database()
      .ref(`User/Detail/${userId}`)
      .update(data)
      .then(() => {
        this.setState({
          loading: false
        });
        this.showAwesomeAlertProfile();
      });
  };

  renderProfileImage() {
    if (this.state.pickImage) {
      return (
        <TouchableOpacity
          onPress={this.imagePicker}
          style={styles.profileImageView}
        >
          <FastImage
            source={
              this.state.avatarSource != null || this.state.avatarSource != ""
                ? this.state.avatarSource
                : null
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={this.imagePicker}
          style={styles.profileImageView}
        >
          <FastImage
            source={
              this.state.avatarSource != null || this.state.avatarSource != ""
                ? { uri: this.state.userinfo.imageprofileuri }
                : null
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
  }

  renderSection() {
    if (this.state.activeIndex == 0) {
      return <View>{this.renderImageSection(this.state.userImagePost)}</View>;
    } else if (this.state.activeIndex == 1) {
      return <View>{this.renderImage(this.state.userImageBought)}</View>;
    } else if (this.state.activeIndex == 2) {
      return (
        <View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
              backgroundColor: "#EEEEEE",
              flexDirection: "row"
            }}
          >
            <Icon
              name="coffee"
              size={24}
              color="#F5A623"
              style={{ paddingHorizontal: 10 }}
            />
            <Text style={styles.textpoint}>
              {this.state.userProfileCurrent.point}
            </Text>
            <Text style={styles.textpoint}> แต้ม</Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderColor: "#eae5e5"
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 25,
                paddingVertical: 5,
                justifyContent: "center",
                borderColor: "#F5A623",
                borderWidth: 2,
                borderRadius: 35
              }}
              onPress={() => this.props.navigation.push("refillPoints")}
            >
              <Text style={[styles.textHeader, { color: "#F5A623" }]}>
                + เติมแต้ม
              </Text>
            </TouchableOpacity>
          </View>

          {this.renderHistorySection(this.state.HistoryPointList)}
        </View>
      );
    }
  }

  segmentClick = index => {
    this.setState({
      activeIndex: index
    });
  };

  renderHistorySection(item) {
    var HistoryList = [];
    for (let i = 0; i < item.length; i += 2) {
      HistoryList.push(
        <View key={i}>
          {item[i] != null ? (
            <View
              style={{
                paddingVertical: 15,
                paddingHorizontal: 25,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#ffecce"
              }}
            >
              <View>
                {item[i].type == "Add" ? (
                  <Text style={styles.textHistoryBold}>เติมแต้มเพิ่ม</Text>
                ) : (
                  <Text style={styles.textHistoryBold}>ใช้แต้ม</Text>
                )}
                <Text style={styles.textHistory}>({item[i].DateTime})</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                {item[i].type == "Add" ? (
                  <Text style={styles.textHistoryBold}>+</Text>
                ) : (
                  <Text style={styles.textHistoryBold}>-</Text>
                )}
                <Text style={styles.textHistoryBold}>{item[i].Point} แต้ม</Text>
              </View>
            </View>
          ) : null}
          {item[i + 1] != null ? (
            <View
              style={{
                paddingVertical: 15,
                paddingHorizontal: 25,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fcf2e3"
              }}
            >
              <View>
                {item[i + 1].type == "Add" ? (
                  <Text style={styles.textHistoryBold}>เติมแต้มเพิ่ม</Text>
                ) : (
                  <Text style={styles.textHistoryBold}>ใช้แต้ม</Text>
                )}
                <Text style={styles.textHistory}>({item[i + 1].DateTime})</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                {item[i + 1].type == "Add" ? (
                  <Text style={styles.textHistoryBold}>+</Text>
                ) : (
                  <Text style={styles.textHistoryBold}>-</Text>
                )}
                <Text style={styles.textHistoryBold}>
                  {item[i + 1].Point} แต้ม
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      );
    }
    return HistoryList;
  }

  renderImageSection(item) {
    var imagelist = [];
    for (let i = 0; i < item.length; i += 3) {
      imagelist.push(
        <View key={i}>
          <View style={{ flexDirection: "row" }}>
            {item[i] != null ? (
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.push("Imagedetail", {
                    Eventname: item[i].title,
                    bib: item[i].bib,
                    photographer: item[i].photographer,
                    uri: item[i].uri,
                    key: item[i]._key
                  })
                }
              >
                <FastImage
                  source={item[i]}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </TouchableHighlight>
            ) : null}
            {item[i + 1] != null ? (
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.push("Imagedetail", {
                    Eventname: item[i + 1].title,
                    bib: item[i + 1].bib,
                    photographer: item[i + 1].photographer,
                    uri: item[i + 1].uri,
                    key: item[i + 1]._key
                  })
                }
              >
                <FastImage
                  source={item[i + 1]}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </TouchableHighlight>
            ) : null}
            {item[i + 2] != null ? (
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.push("Imagedetail", {
                    Eventname: item[i + 2].title,
                    bib: item[i + 2].bib,
                    photographer: item[i + 2].photographer,
                    uri: item[i + 2].uri,
                    key: item[i + 2]._key
                  })
                }
              >
                <FastImage
                  source={item[i + 2]}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </TouchableHighlight>
            ) : null}
          </View>
        </View>
      );
    }
    return imagelist;
  }

  renderImage(item) {
    var imagelist = [];
    for (let i = 0; i < item.length; i += 3) {
      imagelist.push(
        <View key={i}>
          <View style={{ flexDirection: "row" }}>
            {item[i] != null ? (
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.push("ImagedetailDownload", {
                    Eventname: item[i].title,
                    bib: item[i].bib,
                    photographer: item[i].photographer,
                    uri: item[i].uri
                  })
                }
              >
                <FastImage
                  source={item[i]}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </TouchableHighlight>
            ) : null}
            {item[i + 1] != null ? (
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.push("ImagedetailDownload", {
                    Eventname: item[i + 1].title,
                    bib: item[i + 1].bib,
                    photographer: item[i + 1].photographer,
                    uri: item[i + 1].uri
                  })
                }
              >
                <FastImage
                  source={item[i + 1]}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </TouchableHighlight>
            ) : null}
            {item[i + 2] != null ? (
              <TouchableHighlight
                onPress={() =>
                  this.props.navigation.push("ImagedetailDownload", {
                    Eventname: item[i + 2].title,
                    bib: item[i + 2].bib,
                    photographer: item[i + 2].photographer,
                    uri: item[i + 2].uri
                  })
                }
              >
                <FastImage
                  source={item[i + 2]}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </TouchableHighlight>
            ) : null}
          </View>
        </View>
      );
    }
    return imagelist;
  }

  showAwesomeAlertProfile = () => {
    this.setState({
      showAlertawesomeprofile: true
    });
  };

  hideAwesomeAlertProfile = () => {
    this.setState({
      showAlertawesomeprofile: false
    });
  };

  render() {
    const { showAlertawesomeprofile } = this.state;
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
          onBackpress={() => {
            this.props.navigation.push("notification");
          }}
          title={this.props.navigation.getParam("title", "Your Profile")}
        />
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.scrollY } } }
          ])}
        >
          <View
            style={{
              padding: windowWidth * 0.05,
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#eae5e5"
            }}
          >
            <View
              style={{
                flex: 1.6,
                flexDirection: "row",
                alignItems: "flex-end",
                alignSelf: "flex-start"
              }}
            >
              {this.renderProfileImage()}
              <View
                style={{
                  width: windowWidth * 0.06,
                  height: windowWidth * 0.06,
                  borderRadius: windowWidth * 0.06,
                  marginLeft: -windowWidth * 0.06,
                  // marginTop: -windowWidth * 0.06,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F5A623"
                }}
              >
                <Icon name="plus" size={windowWidth * 0.04} color="#fff" />
              </View>
            </View>

            <View style={{ flex: 2 }}>
              <Text
                style={{ fontFamily: Fonts.MosseThai_Extra_Bold, fontSize: 18 }}
              >
                {this.state.userinfo.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  paddingVertical: 5,
                  borderBottomColor: "#eae5e5"
                }}
              >
                <TextMask
                  value={
                    this.state.userinfo.imagePost != null
                      ? "" + this.state.userinfo.imagePost
                      : 0
                  }
                  type={"only-numbers"}
                  style={styles.amountText}
                />
                <TextMask
                  value={
                    this.state.userinfo.eventJoin != null
                      ? "" + this.state.userinfo.eventJoin
                      : 0
                  }
                  type={"only-numbers"}
                  style={[styles.amountText, { textAlign: "center" }]}
                />
                {/* <Text style = {styles.amountText}>{Userprofile.imagePost}</Text> */}
                {/* <Text style = {[styles.amountText,{textAlign: 'center'}]}>{Userprofile.eventJoin}</Text>
                  <Text style = {[styles.amountText,{textAlign: 'right'}]}>{Userprofile.imagesoldout}</Text> */}
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 3
                }}
              >
                <Text style={styles.imagejobtext}>รูปถ่าย</Text>
                <Text style={styles.imagejobtext}>งานที่เข้า</Text>
              </View>
            </View>
            <View style={{ flex: 1 }} />
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
                padding: 15,
                borderBottomWidth: 1,
                borderColor: "#eae5e5",
                justifyContent: "space-between"
              }}
            >
              <TouchableHighlight
                style={{
                  alignItems: "center",
                  paddingHorizontal: windowWidth * 0.05
                }}
                onPress={() => this.segmentClick(0)}
                underlayColor="transparent"
              >
                <Icon
                  name={this.state.activeIndex == 0 ? "th2" : "th"}
                  size={24}
                  color={this.state.activeIndex == 0 ? "#F5A623" : "grey"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  alignItems: "center",
                  paddingHorizontal: windowWidth * 0.05
                }}
                onPress={() => this.segmentClick(1)}
                underlayColor="transparent"
              >
                <Icon
                  name={
                    this.state.activeIndex == 1
                      ? "cart-arrow-down"
                      : "cart-arrow-down2"
                  }
                  size={24}
                  color={this.state.activeIndex == 1 ? "#F5A623" : "grey"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  alignItems: "center",
                  paddingHorizontal: windowWidth * 0.05
                }}
                onPress={() => this.segmentClick(2)}
                underlayColor="transparent"
              >
                <Icon
                  name={this.state.activeIndex == 2 ? "coffee" : "coffee1"}
                  size={24}
                  color={this.state.activeIndex == 2 ? "#F5A623" : "grey"}
                />
              </TouchableHighlight>

              <TouchableHighlight
                style={{
                  alignItems: "center",
                  paddingHorizontal: windowWidth * 0.05
                }}
                onPress={() => this.props.navigation.push("Settingprofile")}
                underlayColor="transparent"
              >
                <Icon
                  name={this.state.activeIndex == 3 ? "cog" : "cog2"}
                  size={24}
                  color={this.state.activeIndex == 3 ? "#F5A623" : "grey"}
                />
              </TouchableHighlight>
            </View>

            {this.renderSection()}
          </View>
        </ScrollView>

        <AwesomeAlert
          show={showAlertawesomeprofile}
          showProgress={false}
          title="สำเร็จ !"
          message="เปลี่ยนรูปโปรไฟล์เสร็จสิ้นแล้ว"
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
            this.hideAwesomeAlertProfile();
          }}
        />
      </View>
    );
  }
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6"
  },
  profileImage: {
    width: windowWidth * 0.23,
    height: windowWidth * 0.23,
    borderRadius: (windowWidth * 0.23) / 2
  },
  profileImageView: {
    backgroundColor: "#EEEEEE",
    width: windowWidth * 0.23,
    height: windowWidth * 0.23,
    borderRadius: (windowWidth * 0.23) / 2
  },
  amountText: {
    fontFamily: Fonts.MosseThai_Extra_Bold,
    fontSize: 16
  },
  imagejobtext: {
    fontFamily: Fonts.MosseThai_Regular,
    fontSize: 13,
    textAlign: "center"
  },
  smallimagesize: {
    height: (windowWidth * 1) / 3,
    width: (windowWidth * 1) / 3,
    transform: [{ scale: 1 }]
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
  textHeader: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 18,
    color: "#5a5a5a"
  },
  textpoint: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 22,
    color: "#F5A623"
  },
  textHistoryBold: {
    fontSize: 15,
    fontFamily: Fonts.MosseThai_Extra_Bold,
    color: "#000"
  },
  textHistory: {
    fontSize: 12,
    fontFamily: Fonts.MosseThai_Regular,
    color: "#000",
    lineHeight: 14
  }
});
