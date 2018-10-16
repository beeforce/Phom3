import React, { Component } from "react";
import { Text, StyleSheet, Animated, Easing } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import ExploreScreen from "../screen/ExploreScreen";
import SearchScreen from "../screen/SearchScreen";
import ProfileScreen from "../screen/ProfileScreen";
import EventDetailScreen from "../screen/EventDetailScreen";
import SaleScreen from "../screen/SaleScreen";
import SettingScreen from "../screen/SettingScreen";
import ImageinfoScreen from "../screen/ImageinfoScreen";
import PhotoEditorScreen from "../screen/PhotoEditorScreen";
import NeweventScreen from "../screen/NeweventScreen";
import addpointScreen from "../screen/addpointScreen";
import ConfirmrefillScreen from "../screen/ConfirmrefillScreen";
import Userprofile from "../screen/Userprofile";
import TabBarIcon from "../styles/tabBarIcon";
import { Fonts } from "../../utill/Fonts";
import ChangepasswordScreen from "../screen/ChangepasswordScreen";
import PaymentCardScreen from "../screen/PaymentCardScreen";
import HelpSettingScreen from "../screen/HelpSettingScreen";
import RecommendAppScreen from "../screen/RecommendAppScreen";
import AddBankAccount from "../screen/AddBankAccount";
import NotificationScreen from "../screen/NotificationScreen";
import NotificationInfoScreen from "../screen/NoticationInfoScreen";

// const navigationOptions = ({ navigation }) => ({
//   header: (
//     <View style = {{height: 56, justifyContent: 'flex-end', backgroundColor: '#fad961'}}>
//         <LinearGradient colors={['#fad961', '#f76b1c']} style = {{flex: 1,}}>
//         </LinearGradient>
//         </View>),
// })

// let TransitionConfiguration = () => {
//   return {
//     transitionSpec: {
//       duration: 600,
//       easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
//       timing: Animated.timing
//     },
//     // Define scene interpolation, eq. custom transition
//     screenInterpolator: sceneProps => {
//       const { position, scene, layout } = sceneProps;
//       const { index, route } = scene;
//       const params = route.routeName || {};
//       const transition = params || "default";

//       if (
//         transition == "Imagedetail" ||
//         transition == "Eventdetail" ||
//         transition == "userprofile" ||
//         transition == "AddnewEvent" ||
//         transition == "PhotoEditor"
//       ) {
//         //zoom in
//         const { index } = scene;
//         const scale = position.interpolate({
//           inputRange: [index - 1, index],
//           outputRange: [0, 1]
//         });

//         return { transform: [{ scale }] };
//       } else if (transition == "notification") {
//         //from Top
//         const { index } = scene;
//         const { initHeight } = layout;

//         const translateY = position.interpolate({
//           inputRange: [index - 1, index, index + 1],
//           outputRange: [-initHeight, 0, 0]
//         });

//         const opacity = position.interpolate({
//           inputRange: [index - 1, index - 0.99, index],
//           outputRange: [0, 1, 1]
//         });

//         return { opacity, transform: [{ translateY }] };
//       } else {
//         //from Left
//         const { initWidth } = layout;

//         const translateX = position.interpolate({
//           inputRange: [index - 1, index, index + 1],
//           outputRange: [-initWidth, 0, 0]
//         });

//         const opacity = position.interpolate({
//           inputRange: [index - 1, index - 0.99, index],
//           outputRange: [0, 1, 1]
//         });

//         return { opacity, transform: [{ translateX }] };
//       }
//     }
//   };
// };

const ExploreStack = createStackNavigator(
  {
    Explore: {
      screen: ExploreScreen
    },
    Eventdetail: {
      screen: EventDetailScreen
    },
    Imagedetail: {
      screen: ImageinfoScreen
    },
    PhotoEditor: {
      screen: PhotoEditorScreen
    },
    refillPoints: {
      screen: addpointScreen
    },
    confirmRefill: {
      screen: ConfirmrefillScreen
    },
    userprofile: {
      screen: Userprofile
    },
    notification: {
      screen: NotificationScreen
    },
    notificationInfo: {
      screen: NotificationInfoScreen
    }
  }
);
ExploreStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <Text
      style={[styles.textTabbarlabel, { color: focused ? "#59aa08" : null }]}
    >
      Explore
    </Text>
  ),
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" />
};

const SearchStack = createStackNavigator({
  Search: {
    screen: SearchScreen
  },
  Eventdetail: {
    screen: EventDetailScreen
  },
  Imagedetail: {
    screen: ImageinfoScreen
  },
  PhotoEditor: {
    screen: PhotoEditorScreen
  },
  AddnewEvent: {
    screen: NeweventScreen
  },
  refillPoints: {
    screen: addpointScreen
  },
  confirmRefill: {
    screen: ConfirmrefillScreen
  },
  userprofile: {
    screen: Userprofile
  },
  notification: {
    screen: NotificationScreen
  },
  notificationInfo: {
    screen: NotificationInfoScreen
  }
});
SearchStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <Text
      style={[styles.textTabbarlabel, { color: focused ? "#59aa08" : null }]}
    >
      Search
    </Text>
  ),
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="search2" />
};

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileScreen
  },
  Salesdetail: {
    screen: SaleScreen
  },
  Settingprofile: {
    screen: SettingScreen
  },
  ChangePassword: {
    screen: ChangepasswordScreen
  },
  PaymentCard: {
    screen: PaymentCardScreen
  },
  Helpsetting: {
    screen: HelpSettingScreen
  },
  Recommendapp: {
    screen: RecommendAppScreen
  },
  AddbackAccount: {
    screen: AddBankAccount
  },
  notification: {
    screen: NotificationScreen
  },
  notificationInfo: {
    screen: NotificationInfoScreen
  }, 
});
ProfileStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <Text
      style={[styles.textTabbarlabel, { color: focused ? "#59aa08" : null }]}
    >
      You
    </Text>
  ),
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="user" />
};

const styles = StyleSheet.create({
  textTabbarlabel: {
    alignSelf: "center",
    fontSize: 11,
    fontFamily: Fonts.MosseThai_Medium,
    paddingBottom: 2,
    paddingTop: -3
  }
});

export default createBottomTabNavigator(
  {
    ExploreStack,
    SearchStack,
    ProfileStack
  },
  {
    navigationOptions: ({ navigation }) => {
      let { routeName } = navigation.state.routes[navigation.state.index];
      let navigationOptions = {};
      if (
        routeName === "Explore" ||
        routeName === "Search" ||
        routeName === "Profile"
      ) {
      } else {
        navigationOptions.tabBarVisible = false;
      }

      return navigationOptions;
    }
    // navigationOptions: ({ navigation }) => {
    //   const { routeName, routes } = navigation.state;
    //   let params = routes && routes[1] && routes[1].params;
    //   return {
    //     tabBarVisible:
    //     params && params.hideTabBar != null ? !params.hideTabBar : true,
    //     swipeEnabled:
    //     params && params.hideTabBar != null ? !params.hideTabBar : true
    //   };
    // },
    // tabBarComponent: TabBarBottom,
    // tabBarPosition: "bottom",
    // animationEnabled: true,
    // swipeEnabled: true
  }
);
