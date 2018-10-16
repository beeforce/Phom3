import React, { Component } from 'react'
import { 
  Text, 
  StyleSheet, 
  View, 
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native'
import CustomToolbarwithNav from '../styles/CustomToolbarwithNav'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../selection.json'; 
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import { Fonts } from '../../utill/Fonts';
import firebase from 'firebase'


export default class SettingScreen extends Component {
  static navigationOptions = () => {
    return {
    header: <View></View>
  };
};
  constructor(props) {
    super(props);
    this.state = {
      userinfo: {}
    };
  }

  componentDidMount(){
    // user id from firebase
    const userId = firebase.auth().currentUser.uid;
    this.getUserdetail(userId)
   
  }

  getUserdetail = (userId) => {
    firebase.database().ref(`User/Detail/${userId}`).on('value', snapshot=> {
      let Userprofile = {}
      Userprofile.name = snapshot.child('Name').val()
      Userprofile.imageprofileuri = snapshot.child('PhotoURL').val()
      Userprofile.email = snapshot.child('Email').val()

        this.setState({
          userinfo: Userprofile,
        });
        // })
      })
  }

  render() {
    return (
      <View style = {styles.container}>
        <CustomToolbarwithNav  title = {this.props.navigation.getParam('title', 'Settings')} 
        onBackpress = {() => {this.props.navigation.goBack()}} onBellpress = {() => {this.props.navigation.push('notification')}}/>
        <View style = {{paddingHorizontal: windowWidth * 0.055, paddingVertical: windowWidth * 0.04,  borderBottomColor: '#eae5e5', borderBottomWidth: 1}}>
        <Text style = {styles.textHeader}>บัญชีผู้ใช้</Text>

        
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.texttitle}>Email ที่สมัคร</Text>
        <Text style = {{fontFamily: Fonts.MosseThai_Medium, color: '#000'}}>{this.state.userinfo.email}</Text>
        </View>
        

        <View>
        <TouchableHighlight underlayColor = '#fff' 
        onPress={() => this.props.navigation.push('ChangePassword')}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.texttitle}>รหัสผ่าน</Text>
        <Icon name = "chevron-right" color = '#5a5a5a' size = {16} style = {{alignSelf: 'center'}} />
        </View>
        </TouchableHighlight>
        </View>

        <View>
        <TouchableHighlight underlayColor = '#fff' 
        onPress={() => this.props.navigation.push('PaymentCard')}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.texttitle}>การชำระเงิน</Text>
        <Icon name = "chevron-right" color = '#5a5a5a' size = {16} style = {{alignSelf: 'center'}} />
        </View>
        </TouchableHighlight>
        </View>

        <View>
        <TouchableHighlight underlayColor = '#fff' 
        onPress={() => this.props.navigation.push('AddbackAccount')}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.texttitle}>บัญชีรับเงินถอน</Text>
        <Icon name = "chevron-right" color = '#5a5a5a' size = {16} style = {{alignSelf: 'center'}} />
        </View>
        </TouchableHighlight>
        </View>

        <View>
        <TouchableHighlight underlayColor = '#fff' 
        onPress={() => { this.props.navigation.navigate('HomepageCustomer'); }}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.texttitle}>เปลี่ยนเป็นผู้ซื้อภาพ</Text>
        <Icon name = "chevron-right" color = '#5a5a5a' size = {16} style = {{alignSelf: 'center'}} />
        </View>
        </TouchableHighlight>
        </View>

        </View>

        <View style = {{paddingHorizontal: windowWidth * 0.055, paddingTop: windowWidth * 0.04}}>
        <Text style = {styles.textHeader}>ข้อมูลระบบ</Text>

        <View>
        <TouchableHighlight underlayColor = '#fff' 
        onPress={() => this.props.navigation.push('Recommendapp')}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.texttitle}>ข้อแนะนำติชม</Text>
        <Icon name = "chevron-right" color = '#5a5a5a' size = {16} style = {{alignSelf: 'center'}} />
        </View>
        </TouchableHighlight>
        </View>

        <View>
        <TouchableHighlight underlayColor = '#fff'
        onPress={() => this.props.navigation.push('Helpsetting')}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.texttitle}>ต้องการความช่วยเหลือ</Text>
        <Icon name = "chevron-right" color = '#5a5a5a' size = {16} style = {{alignSelf: 'center'}} />
        </View>
        </TouchableHighlight>
        </View>
        
        <TouchableOpacity onPress={()=> {
          firebase.auth().signOut().then(()=> {
          //   const resetAction = StackActions.reset({
          //   index: 0,
          //   key: null,
          //   actions: [NavigationActions.navigate({ routeName: 'Login' })],
          // });
          // this.props.navigation.dispatch(resetAction);
          this.props.navigation.navigate('Login');
          })
        }}>
        <Text style = {[styles.texttitle,{color:'#f79915'}]}>ออกจากระบบ</Text>
        </TouchableOpacity>

        </View>

      </View>
    )
  }
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: '#f6f6f6',
    },
    textHeader:{
      fontFamily: Fonts.MosseThai_Bold,
      fontSize: 17,
      color: '#000',
      marginBottom: 5
    },
    texttitle:{
      fontFamily: Fonts.MosseThai_Regular,
      fontSize: 16,
      color: '#5a5a5a',
      marginBottom: 4
    }
})
