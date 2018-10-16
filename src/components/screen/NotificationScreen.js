import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal
} from "react-native";
import { Fonts } from "../../utill/Fonts";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import LinearGradient from "react-native-linear-gradient";
import IcoMoonConfig from "../../selection.json";
import FastImage from "react-native-fast-image";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import firebase from "@firebase/app";
const ITEMS_PER_PAGE = 10;

// const dataTips = [
//   {id: "1", type: 'favorite', read: false,
//   title: 'Get up to speed on Endlish for Work', date: '09/14/18 12:16:56'},
//   {id: "2", type: 'cartPoint', read: true,
//   title: '1', date: '09/13/18 16:16:56'},
//   {id: "3", type: 'cartPhoto', read: false,
//   title: 'Get up to speed on Endlish for Work', date: '09/13/18 16:16:56'},
//   {id: "4", type: 'favorite', read: false,
//   title: 'Speaking for fun!', date: '09/12/18 16:16:56'},
// ]

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

export default class NotificationScreen extends Component {
  static navigationOptions = () => {
    return {
      header: <View />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      NotifyData: [],
      page: 1,
      loading: true
    };
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    this.getNotificationUser(userId);
  }

  getNotificationUser(userId) {
    firebase
      .database()
      .ref(`Notification/${userId}`)
      .on("value", dataSnapshot => {
        let NotifyData = [];
        dataSnapshot.forEach(child => {
          let d = new Date(child.val().date);
          NotifyData.push({
            NotifyId: child.key,
            HistoryId: child.val().HistoryId,
            date: child.val().date,
            read: child.val().read,
            title: child.val().title,
            type: child.val().type,
            Imageuri: child.val().Imageuri,
            datetime: d.getTime()
          });
        });
        let dataSorted = []
          .concat(NotifyData)
          .sort((a, b) => b.datetime - a.datetime);
        this.setState({
          NotifyData: dataSorted,
          loading: false
        });
      });
  }

  updateStatusNofication(notifyId, historyId, type, Imageuri, read) {
    
    if(read == false){
      const userId = firebase.auth().currentUser.uid;
      let data = {
        read: true
      };
      firebase
        .database()
        .ref(`Notification/${userId}/${notifyId}`)
        .update(data);
    }

    // .then(() => {})

    this.props.navigation.navigate("notificationInfo", {
      HistoryId: historyId,
      type: type,
      Imageuri: Imageuri
    });
  }

  loadMore = () => {
    const { page, NotifyData } = this.state;
    const data = NotifyData;
    const start = page * ITEMS_PER_PAGE;
    const end = (page + 1) * ITEMS_PER_PAGE - 1;

    const newData = data.slice(start, end); // here, we will receive next batch of the items
    this.setState({ NotifyData: [...NotifyData] }); // here we are appending new batch to existing batch
  };

  getImageTypeTips = (type, state, uri) => {
    switch (type) {
      case "favorite":
        return (
          <View
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#F5A623",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100
            }}
          >
            <Icon
              name={state == false ? "heart2" : "heart"}
              size={14}
              color="#fff"
            />
          </View>
        );
      case "cartPoint":
        return (
          <View
            style={{
              width: 44,
              height: 44,
              backgroundColor: "#F5A623",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 100
            }}
          >
            <Icon
              name={state == false ? "cart-arrow-down" : "cart-arrow-down2"}
              size={14}
              color="#fff"
            />
          </View>
        );
      case "cartPhoto":
        return (
          <FastImage
            source={{ uri: uri }}
            resizeMode="cover"
            style={{
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              padding: 13,
              borderRadius: 100
            }}
          />
        );
      case "soldPhoto":
        return (
          <FastImage
            source={{ uri: uri }}
            resizeMode="cover"
            style={{
              width: 44,
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              padding: 13,
              borderRadius: 100
            }}
          />
        );
    }
  };

  gettextHistory = (type, title) => {
    switch (type) {
      case "favorite":
        return (
          <View>
            <Text
              numberOfLines={2}
              style={{
                color: "#484848",
                fontSize: 14,
                fontFamily: Fonts.MosseThai_Regular
              }}
            >
              มีความเคลื่อนไหวในงานที่คุณกดชอบ
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Bold
                }}
              >
                {" "}
                "{title}"
              </Text>
            </Text>
          </View>
        );
      case "cartPoint":
        return (
          <View>
            <Text
              numberOfLines={2}
              style={{
                color: "#484848",
                fontSize: 14,
                fontFamily: Fonts.MosseThai_Regular
              }}
            >
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Bold
                }}
              >
                การเติมแต้มสำเร็จ{" "}
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Regular
                }}
              >
                คุณได้ทำการเติมแต้มสำเร็จเป็นจำนวน
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Bold
                }}
              >
                {" "}
                {title} แต้ม{" "}
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Regular
                }}
              >
                เป็นที่เรียบร้อย
              </Text>
            </Text>
          </View>
        );
      case "cartPhoto":
        return (
          <View>
            <Text
              numberOfLines={2}
              style={{
                color: "#484848",
                fontSize: 14,
                fontFamily: Fonts.MosseThai_Regular
              }}
            >
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Bold
                }}
              >
                การซื้อภาพสำเร็จ{" "}
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Regular
                }}
              >
                คุณได้ทำการซื้อภาพจากงาน
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Bold
                }}
              >
                {" "}
                "{title}"
              </Text>
            </Text>
          </View>
        );
      case "soldPhoto":
        return (
          <View>
            <Text
              numberOfLines={2}
              style={{
                color: "#484848",
                fontSize: 14,
                fontFamily: Fonts.MosseThai_Regular
              }}
            >
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Bold
                }}
              >
                การขายภาพสำเร็จ{" "}
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Regular
                }}
              >
                ภาพจากงาน
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Bold
                }}
              >
                "{title}"
              </Text>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 14,
                  fontFamily: Fonts.MosseThai_Regular
                }}
              >
                ของคุณ ได้ถูกซื้อเรียบร้อยแล้ว
              </Text>
            </Text>
          </View>
        );
    }
  };

  msToTime = (duration, date) => {
    const monthNames = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค."
    ];
    var minutes = parseInt(duration / (1000 * 60)),
      hours = parseInt(duration / (1000 * 60 * 60));

    if (hours == 0 && minutes >= 1) {
      return minutes + " นาทีที่แล้ว";
    } else if (hours >= 24) {
      let date2 = new Date(date);
      let minutes = date2.getMinutes(),
        hours = date2.getHours();

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      return (
        date2.getDate() +
        " " +
        monthNames[date2.getMonth()] +
        " เวลา " +
        hours +
        ":" +
        minutes +
        " น."
      );
    } else if (minutes == 0) {
      return "เมื่อสักครู่";
    }
    return hours + " ชั่วโมงที่แล้ว";
  };

  renderItemTips(item) {
    let date = new Date(item.date);
    let today = new Date();
    var duration = today.getTime() - date.getTime();
    console.log(item.Imageuri);
    var result_Time = this.msToTime(duration, item.date);
    return (
      <View
        style={
          item.read == false
            ? { flex: 1, backgroundColor: "#ffecce" }
            : { flex: 1 }
        }
      >
        <TouchableOpacity
          onPress={() =>
            this.updateStatusNofication(
              item.NotifyId,
              item.HistoryId,
              item.type,
              item.Imageuri,
              item.read
            )
          }
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              paddingVertical: 15,
              paddingHorizontal: 10
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.getImageTypeTips(item.type, item.read, item.Imageuri)}
            </View>

            <View style={{ flex: 4.5, marginHorizontal: 10 }}>
              {this.gettextHistory(item.type, item.title)}
            </View>

            <View style={{ flex: 1.2, alignSelf: "flex-start" }}>
              <Text
                style={{
                  color: "#484848",
                  fontSize: 10,
                  alignSelf: "center",
                  fontFamily: Fonts.MosseThai_Regular
                }}
              >
                {result_Time}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
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
        <CustomToolbarwithNav
          title={this.props.navigation.getParam("title", "Notification")}
          onBackpress={() => {
            this.props.navigation.pop(1);
          }}
        />
        <FlatList
          data={this.state.NotifyData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItemTips(item)}
        />
      </View>
    );
  }
}

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
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2
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
