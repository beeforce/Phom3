import React, { Component } from 'react'
import { 
  Text, 
  StyleSheet, 
  View,
  TouchableOpacity,
  Dimensions
 } from 'react-native'
import CustomToolbarwithNav from '../styles/CustomToolbarwithNav'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../selection.json'; 
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import { Fonts } from '../../utill/Fonts';
import firebase from "@firebase/app"

export default class addpointScreen extends Component {

  static navigationOptions = {
    header: <View></View>,
  };

  constructor() {
    super();
    this.state = {
      userProfileCurrent: []
    };
  }

  componentDidMount(){
    const userId = firebase.auth().currentUser.uid;
    this.getuserinformationCurrent(userId)
    }
    

  getuserinformationCurrent = (userId) => {
    firebase.database().ref(`User/Detail/${userId}`).on('value', snapshot => {
      let UserdetailProfile = {}
      UserdetailProfile.name = snapshot.child('Name').val()
      UserdetailProfile.point = snapshot.child('Point').val()
  
        this.setState({
          userProfileCurrent: UserdetailProfile,
        });
      })
  }

  render() {
    const Eventname = this.props.navigation.getParam('Eventname');
    return (
      <View style = {styles.container}>
      <CustomToolbarwithNav  title = {this.props.navigation.getParam('title', Eventname)}
      onBackpress = {() => {this.props.navigation.goBack()}} onBellpress = {() => {this.props.navigation.push('notification')}}/>
      <View style = {styles.container}>
      <View style = {[styles.vieweachLayout, {justifyContent: 'center'}]}>
        <Text style = {[styles.textHeader,{paddingHorizontal: 5}]}>My Points:</Text>
        <Icon name = "coffee" size={26} color = '#F5A623' style = {{paddingHorizontal: 5}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 23}]}>{''+this.state.userProfileCurrent.point}</Text>
      </View>
      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>1</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 1, price: 30})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB30</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>2</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 2, price: 59})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB59</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>3</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 3, price: 89})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB89</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>4</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 4, price: 129})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB129</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>10</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 10, price: 269})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB269</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>16</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 16, price: 409})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB409</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>32</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 32, price: 799})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB799</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {styles.vieweachLayout}>
      <View style = {{flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline'}}>
        <Icon name = "coffee" size={22} color = '#F5A623' style = {{paddingHorizontal: 5,}} />
        <Text style = {[styles.textHeader,{paddingHorizontal: 5, fontSize: 20,}]}>66</Text>
      </View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('confirmRefill',{ coin: 66, price: 1640})}
      style = {{alignSelf: 'flex-start', backgroundColor: '#F5A623', borderRadius: 30, paddingVertical:5, paddingHorizontal: 17}} >
        <Text style = {[styles.textHeader,{color: '#fff'}]}>THB1640</Text>
      </TouchableOpacity>
      </View>
      </View>

      <View style = {{flex: 1.5, alignItems:'center', justifyContent: 'center'}}>
      <Text style = {[styles.textHeader,{color: '#F5A623'}]}>ไม่มีวันหมดอายุ</Text>
      </View>
      </View>
      </View>
    )
  }
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    vieweachLayout:{
      flex: 1,
      borderBottomWidth: 1, 
      borderBottomColor: '#eae5e5',
      alignItems:'center',
      flexDirection: 'row',
      paddingHorizontal: windowWidth * 0.1
  },
    textHeader:{
      fontFamily: Fonts.MosseThai_Bold,
      fontSize: 19,
      color: '#5a5a5a',
    },
})
