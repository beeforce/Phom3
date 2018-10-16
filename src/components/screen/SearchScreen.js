import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableHighlight,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { Fonts } from "../../utill/Fonts";
import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import IcoMoonConfig from "../../selection.json";
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import LinearGradient from "react-native-linear-gradient";
import ActionButton from "react-native-action-button";
import firebase from "@firebase/app";

var Activitydata = [
  // { id: "1", title: 'วิ่งแบบพี่ตูน',
  // views: 18.4},
  // { id: "2", title: 'วิ่งพายัพ',
  // views: 13.1},
  // { id: "3", title: 'ร่วมใจกาชาดวิ่งต้านมะเร็งเต้านม',
  // views: 12.9},
  // { id: "4", title: 'Home Runner',
  // views: 11},
  // { id: "5", title: 'โดราเอมอน รันเนอร์ โกลบอล',
  // views: 8.4},
];

class CustomToolbar extends Component {
  _handleChangeText = text => {
    this.setState({ text });
    this.props.onChangeQuery && this.props.onChangeQuery(text);
  };

  render() {
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <LinearGradient colors={["#fad961", "#f76b1c"]}>
          <SafeAreaView>
            <View
              style={{
                height: 56,
                justifyContent: "flex-end",
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  margin: 7,
                  marginLeft: 10
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center"
                  }}
                >
                  <Icon
                    name="search"
                    size={18}
                    style={{ paddingLeft: 20, padding: 2 }}
                  />
                  <TextInput
                    style={styles.toolbarTitle}
                    onChangeText={text => {
                      this._handleChangeText(text);
                    }}
                    underlineColorAndroid="transparent"
                    returnKeyType="done"
                    placeholderTextColor="#626262"
                    placeholder="ค้นหา"
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={this.props.onBackpress}
                style={styles.toolbarBellimage}
              >
                <Icon name="bell" size={16} color="#f76b1c" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
}

export default class SearchScreen extends Component {
  static navigationOptions = () => {
    return {
      header: <View />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      Eventsdata: [],
      EventsdataTop5: [],
      q: ""
    };
  }
  componentDidMount() {
    this.getEvents();
  }

  getEvents() {
    firebase
      .database()
      .ref(`Events/Approve`)
      .on("value", dataSnapshot => {
        Activitydata = [];
        dataSnapshot.forEach(child => {
          Activitydata.push({
            title: child.key,
            views: child.val().views
          });
        });
        let dataSorted = []
          .concat(Activitydata)
          .sort((a, b) => b.views - a.views);

        this.setState({
          Eventsdata: dataSorted,
          EventsdataTop5: dataSorted
        });
      });
  }

  // TODO: debounce
  _handleChangeQuery = q => {
    this.props.onChangeQuery && this.props.onChangeQuery(q);
    this.searchText(q);
    this.setState({
      q: q
    });
  };

  searchText = e => {
    let text = e.toLowerCase();
    let trucks = Activitydata;
    let filteredName = trucks.filter(item => {
      return item.title.toLowerCase().match(text);
    });
    if (!text || text === "") {
      this.setState({
        Eventsdata: Activitydata
      });
    } else if (Array.isArray(filteredName)) {
      this.setState({
        noData: false,
        Eventsdata: filteredName
      });
    }
  };

  EventDetailpage = (view, eventName) => {
    firebase
      .database()
      .ref("Events/Approve")
      .child(`${eventName}`)
      .update({
        views: view + 1
      });
    this.props.navigation.push("Eventdetail", { Eventname: eventName });
  };

  renderItem(item) {
    var eventTop5 = [];
    for (let i = 0; i < 5; i++) {
      eventTop5.push(
        <View key={i}>
          {item[i] != null ? (
            <View
              style={{
                paddingTop: 10,
                borderBottomWidth: 1,
                borderColor: "#eae5e5",
                paddingBottom: 10
              }}
            >
              <TouchableHighlight
                underlayColor="#c9c9c9"
                onPress={() => {
                  this.EventDetailpage(item[i].views, item[i].title);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    paddingLeft: 20,
                    paddingRight: 20
                  }}
                >
                  <Text style={styles.textTitleList}>{i + 1}</Text>
                  <View style={{ flexDirection: "column", paddingLeft: 15 }}>
                    <Text style={styles.textTitleList}>{item[i].title}</Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: Fonts.MosseThai_Regular
                      }}
                    >
                      {"" + item[i].views} ครั้ง
                    </Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          ) : null}
        </View>
      );
    }
    return eventTop5;
  }

  renderItemSearch(item) {
    return (
      <View
        style={{
          paddingTop: 10,
          borderBottomWidth: 1,
          borderColor: "#eae5e5",
          paddingBottom: 10
        }}
      >
        <TouchableHighlight
          underlayColor="#c9c9c9"
          onPress={() => {
            this.EventDetailpage(item.views, item.title);
          }}
        >
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Text style={styles.textTitleList}>{item.title}</Text>
            <Text style={{ fontSize: 13, fontFamily: Fonts.MosseThai_Regular }}>
              {"" + item.views} ครั้ง
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    const { q } = this.state;
    return (
      <View style={styles.container}>
        <CustomToolbar
          onChangeQuery={this._handleChangeQuery}
          onBackpress={() => {
            this.props.navigation.push("notification");
          }}
        />

        {q === "" ? (
          <View style={{ borderBottomWidth: 1, borderColor: "#eae5e5" }}>
            <Text style={styles.textHeader}>งานยอดนิยมในขณะนี้</Text>
          </View>
        ) : null}
        {q === "" ? (
          this.renderItem(this.state.EventsdataTop5)
        ) : (
          <FlatList
            data={this.state.Eventsdata}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => this.renderItemSearch(item)}
          />
        )}
        <ActionButton
          buttonColor="rgb(245, 166, 35)"
          style={{ flex: 0.2 }}
          fixNativeFeedbackRadius={true}
          shadowStyle={{
            shadowColor: "#000000",
            shadowOpacity: 0.8,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 0
            }
          }}
          onPress={() =>
            this.props.navigation.push("AddnewEvent", { hideTabBar: true })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.MosseThai_Medium,
    marginLeft: 10,
    color: "#000",
    width: null
  },
  toolbarBellimage: {
    height: 35,
    width: 35,
    borderRadius: 18,
    marginRight: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  textHeader: {
    color: "#000",
    fontFamily: Fonts.MosseThai_Bold,
    fontSize: 17,
    padding: 15
  },
  textTitleList: {
    fontSize: 17,
    fontFamily: Fonts.MosseThai_Bold,
    color: "#000"
  }
});
