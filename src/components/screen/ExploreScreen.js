import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Animated,
  FlatList,
  TouchableHighlight,
  Modal,
  ActivityIndicator
} from "react-native";
import { Fonts } from "../../utill/Fonts";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import { NavigationActions } from "react-navigation";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import CustomToolbar from "../styles/CustomToolbar";
import LinearGradient from "react-native-linear-gradient";
import { LinearTextGradient } from "react-native-text-gradient";
import FastImage from "react-native-fast-image";
import firebase from "@firebase/app";
import ImageBackground from "../styles/ImageBackground";
import { zoomIn } from 'react-navigation-transitions';


export default class ExploreScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: <View />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      Imagedata: [],
      maxImageindex: 18,
      loading: true
    };
  }

  // onButtonPress = () => {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  // }

  // handleBackButton = () => {
  //   this.props.navigation.pop()
  //   return true;
  // }

  componentDidMount() {
    // user id from firebase
    const userId = firebase.auth().currentUser.uid;
    this.getEvents();
    this.getImages(userId);
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  // componentWillUnmount(){
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  // }

  getEvents() {
    // const monthNames = ["January", "February", "March", "April", "May", "June",
    // "July", "August", "September", "October", "November", "December"
    // ];
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC"
    ];
    firebase
      .database()
      .ref(`Events/Approve`)
      .on("value", dataSnapshot => {
        let Activitydata = [];
        let ActivityPastdata = [];
        let today = new Date();
        dataSnapshot.forEach(child => {
          let d = new Date(child.val().date);
          if (today.getTime() <= d.getTime()) {
            Activitydata.push({
              uri: child.val().eventImageurl,
              date: "" + d.getDate(),
              month: monthNames[d.getMonth()],
              title: child.key,
              location: child.val().place,
              datetime: d.getTime()
            });
          } else {
            ActivityPastdata.push({
              uri: child.val().eventImageurl,
              date: "" + d.getDate(),
              month: monthNames[d.getMonth()],
              title: child.key,
              location: child.val().place,
              datetime: d.getTime()
            });
          }
        });
        let eventdataSorted = []
          .concat(Activitydata)
          .sort((a, b) => a.datetime - b.datetime);

        let eventPastdataSorted = []
          .concat(ActivityPastdata)
          .sort((a, b) => b.datetime - a.datetime);

        this.setState({
          Eventsdata: eventdataSorted,
          EventsPastdata: eventPastdataSorted
        });
      });
  }

  getImages(userId) {
    firebase
      .database()
      .ref(`User/Photo/${userId}/Bought`)
      .on("value", dataSnapshot => {
        let imagelistBought = [];
        let imagelistPost = [];
        let ImageList = [];
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
            imagelistPost = [];
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

            firebase
              .database()
              .ref(`Photos`)
              .on("value", dataSnapshot => {
                ImageList = [];
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
                // console.log(ImageList)
                this.setState({
                  Imagedata: ImageList,
                  loading: false
                });
              });
          });
      });
  }

  renderUpcomingActivity(item) {
    return (
      <View style={styles.viewImagebackgroundOverlay}>
        <TouchableHighlight
          underlayColor="#c9c9c9"
          onPress={() =>
            this.props.navigation.navigate("Eventdetail", { Eventname: item.title })
          }
        >
          <ImageBackground
            style={styles.ImagebackgroundOverlay}
            source={{ uri: item.uri }}
            imageStyle={{ borderRadius: 10 }}
          >
            <LinearGradient
              start={{ x: 0.8, y: 0 }}
              end={{ x: 0, y: 0 }}
              colors={["rgba(100, 100, 100, 0)", "#161616"]}
              style={styles.overlayColorLinear}
            >
              <View>
                <Text style={styles.date}>
                  {item.date}
                  {"\n"}
                  {item.month}
                </Text>
                <Text style={styles.title}>"{item.title}"</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="map-marker-alt"
                    size={12}
                    color="#fff"
                    style={{ paddingTop: 1 }}
                  />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableHighlight>
      </View>
    );
  }

  renderImage(item) {
    let imagelist = [];
    for (let i = 0; i < this.state.maxImageindex; i += 18) {
      imagelist.push(
        <View key={i}>
          <View style={{ flexDirection: "row" }}>
            <View>
              {item[i] != null ? (
                <View>
                  <FastImage
                    source={{ uri: item[i].uri }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles.smallimagesize}
                  />
                </View>
              ) : null}
              {item[i + 1] != null ? (
                <View>
                  <FastImage
                    source={{ uri: item[i + 1].uri }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles.smallimagesize}
                  />
                </View>
              ) : null}
            </View>
            {item[i + 2] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 2].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.largeimagesize}
                />
              </View>
            ) : null}
          </View>

          <View style={{ flexDirection: "row" }}>
            {item[i + 3] != null ? (
             <View>
                <FastImage
                  source={{ uri: item[i + 3].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 4] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 4].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 5] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 5].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
          </View>

          <View style={{ flexDirection: "row" }}>
            {item[i + 6] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 6].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 7] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 7].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 8] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 8].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
          </View>

          <View style={{ flexDirection: "row" }}>
            {item[i + 9] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 9].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.largeimagesize}
                />
              </View>
            ) : null}
            <View>
              {item[i + 10] != null ? (
               <View>
                  <FastImage
                    source={{ uri: item[i + 10].uri }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles.smallimagesize}
                  />
                </View>
              ) : null}
              {item[i + 11] != null ? (
                <View>
                  <FastImage
                    source={{ uri: item[i + 11].uri }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={styles.smallimagesize}
                  />
                </View>
              ) : null}
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
            {item[i + 12] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 12].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 13] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 13].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 14] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 14].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
          </View>

          <View style={{ flexDirection: "row" }}>
            {item[i + 15] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 15].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 16] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 16].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
            {item[i + 17] != null ? (
              <View>
                <FastImage
                  source={{ uri: item[i + 17].uri }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.smallimagesize}
                />
              </View>
            ) : null}
          </View>
        </View>
      );
    }
    return imagelist;
  }

  render() {
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
          title={this.props.navigation.getParam("title", "Discover")}
        />
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.scrollY } } }
          ])}
          nestedScrollEnabled
          onScrollEndDrag={() => {
            const { maxImageindex } = this.state;
            this.setState({
              maxImageindex: maxImageindex + 18
            });
          }}
        >
          <View style={{ paddingLeft: windowWidth * 0.05, paddingBottom: 19 }}>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <LinearGradient
                colors={["#fad961", "#f76b1c"]}
                style={{
                  height: 27,
                  width: 5,
                  margin: 15,
                  marginLeft: 5,
                  borderRadius: 10
                }}
              />
              <LinearTextGradient
                style={{
                  fontFamily: Fonts.MosseThai_Bold,
                  fontSize: 22,
                  color: "#ed7c20"
                }}
                locations={[0, 1]}
                colors={["#f76b1c", "#fad961"]}
                start={{ x: 0, y: 1.5 }}
                end={{ x: 0, y: 0 }}
              >
                <Text>Upcoming Marathon</Text>
              </LinearTextGradient>
            </View>
            <View>
              <ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event([
                  { nativeEvent: { contentOffset: { x: this.scrollX } } }
                ])}
                horizontal
              >
                <FlatList
                  data={this.state.Eventsdata}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => this.renderUpcomingActivity(item)}
                  horizontal
                />
              </ScrollView>
            </View>

            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <LinearGradient
                colors={["#fad961", "#f76b1c"]}
                style={{
                  height: 27,
                  width: 5,
                  margin: 15,
                  marginLeft: 5,
                  borderRadius: 10
                }}
              />
              <LinearTextGradient
                style={{
                  fontFamily: Fonts.MosseThai_Bold,
                  fontSize: 22,
                  color: "#ed7c20"
                }}
                locations={[0, 1]}
                colors={["#f76b1c", "#fad961"]}
                start={{ x: 0, y: 2 }}
                end={{ x: 0, y: 0 }}
              >
                <Text>The Past Marathon</Text>
              </LinearTextGradient>
            </View>
            <View>
              <ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event([
                  { nativeEvent: { contentOffset: { x: this.scrollX } } }
                ])}
                horizontal
              >
                <FlatList
                  data={this.state.EventsPastdata}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => this.renderUpcomingActivity(item)}
                  horizontal
                />
              </ScrollView>
            </View>
          </View>

          {this.renderImage(this.state.Imagedata)}
        </ScrollView>
      </View>
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
  toolbarTitle: {
    fontSize: 20,
    fontFamily: Fonts.MosseThai_Bold,
    color: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    paddingLeft: 20,
    paddingBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
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
  date: {
    fontFamily: Fonts.MosseThai_Extra_Bold,
    fontSize: 27,
    color: "#fff",
    lineHeight: 29,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  title: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 16,
    color: "#fff",
    lineHeight: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    flex: 1,
    flexWrap: "wrap"
  },
  location: {
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 12,
    color: "#fff",
    paddingLeft: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  overlayColorLinear: {
    flex: 1,
    height: null,
    width: null,
    alignItems: "flex-start",
    padding: 15,
    paddingLeft: 10,
    borderRadius: 10
  },
  ImagebackgroundOverlay: {
    flex: 1,
    borderRadius: 10,
    height: null,
    width: null
  },
  viewImagebackgroundOverlay: {
    flex: 1,
    height: null,
    width: windowWidth * 0.55,
    borderRadius: 10,
    marginRight: 15
  },
  largeimagesize: {
    height: (windowWidth * 2) / 3,
    width: (windowWidth * 2) / 3,
    transform: [{ scale: 1 }]
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
  }
});
