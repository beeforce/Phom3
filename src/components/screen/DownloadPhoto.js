import React, { Component } from 'react'
import { 
  Text, 
  StyleSheet, 
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  ActivityIndicator,
  CameraRoll,
  Modal
 } from 'react-native'
import CustomToolbarwithNav from '../styles/CustomToolbarwithNav'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../selection.json'; 
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import { Fonts } from '../../utill/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import Permissions from 'react-native-permissions'
import AwesomeAlert from 'react-native-awesome-alerts'

export default class DownloadPhoto extends Component {
    static navigationOptions = () => {
        return {
          header: <View></View>,
        };
      };
    
    constructor() {
        super();
        this.state = {
        loading: true,
        showAlertDownloadphoto: false,
        loadingConfirm: false
        };
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this._requestPermission('camera')
        this._requestPermission('photo')  
    }

    _openSettings = () =>{
      Permissions.openSettings()
  
    }
  
  
    _requestPermission = permission => {
      var options
  
      if (permission == 'location') {
        options = this.state.isAlways ? 'always' : 'whenInUse'
      }
  
      Permissions.request(permission, options)
        .then(res => {
          this.setState({
            status: { ...this.state.status, [permission]: res },
          })
          console.log(res)
          if (res != 'authorized') {
            console.log(res)
            var buttons = [{ text: 'Cancel', style: 'cancel' },]
              buttons.push({
                text: 'Open Settings',
                onPress: this._openSettings,
              })
  
            Alert.alert(
              'Whoops!',
              'There was a problem getting your permission. Please enable it from settings.',
              buttons,
            )
          }else{
          }
        })
        .catch(() =>{
          this._openSettings
        })
    }
       

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        }
        
    handleBackPress = () => {
        return true;
        }

    saveToStorage = (Imageuri) => {
      this.setState({loadingConfirm: true})
      CameraRoll.saveToCameraRoll(Imageuri, 'photo').then(() =>{
        this.showAwesomeAlertDownloadphoto()
      }).catch((error) => {
        Alert.alert('',error.toString(), [{text: 'OK'}], { cancelable: false });
    })
    }

    showAwesomeAlertDownloadphoto = () => {
        this.setState({
          showAlertDownloadphoto: true,
          loadingConfirm: false
        })
      };
    
      AcceptAwesomeAlertDownloadphoto = () =>{
        this.setState({
          showAlertDownloadphoto: false,
        });
      }


    render() {
    const Eventname = this.props.navigation.getParam('Eventname');
    const Imageuri = this.props.navigation.getParam('uri');
    const bib = this.props.navigation.getParam('bib');
    const {showAlertDownloadphoto} = this.state;

        return (
        <View style = {styles.container}>

        <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.loadingConfirm}
            onRequestClose={() => {console.log('close modal')}}>
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={this.state.loadingConfirm}
                  size = "large"
                  color = "#000" />
              </View>
            </View>
        </Modal>

        <CustomToolbarwithNav title = {this.props.navigation.getParam('title', Eventname)}
        onBackpress = {() => {this.props.navigation.goBack()}} onBellpress = {() => {this.props.navigation.push('notification')}}/>

      <ImageBackground style = {{flex:6, width: null, height: null, alignItems: 'center', justifyContent: 'center',}}
        onLoadEnd = {()=> {
                this.setState({loading: false})
            }}
          source= {{uri: Imageuri}}>
          <ActivityIndicator
                animating={this.state.loading}
                size = 'small'
                color = '#000' />
      </ImageBackground>

      <View style = {{flex:4.5}}>
      
      <View style = {{flex: 1.5, alignItems: 'center', justifyContent: 'flex-end',}}>
      <Text style = {styles.textHeader}>ดาวน์โหลดรูปภาพ</Text>
      <Text style = {{fontFamily: Fonts.MosseThai_Medium, color: '#a9abad', fontSize: 14 }}>สามารถโหลดซ้ำใน Menu Profile ของคุณ</Text>
      </View>

      <View style = {{flex: 3}}>
      <View style = {{flex:1 , flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 15, justifyContent: 'space-around'}}>
      
      <View>
      <TouchableOpacity  onPress = {() => {this.saveToStorage(Imageuri)}} >
      <View style = {{width: windowWidth * 0.205, height: windowWidth * 0.2, borderRadius: windowWidth *0.2 /2, marginBottom: 10}}>
       <LinearGradient
      colors={['#fad961', '#f76b1c']} style = {{flex: 1, borderRadius: windowWidth *0.2 /2, justifyContent: 'center', alignItems: 'center'}}>
       <Icon name = "arrow-to-bottom2" size={31} color = '#fff' style = {{paddingTop: 2}}/>
      </LinearGradient>
      </View>
      </TouchableOpacity>
      <Text style = {styles.textEditor}>Camera</Text>
      <Text style = {styles.textEditor}>Roll</Text>
      </View>

      <View>
      <TouchableOpacity onPress = {() => this.props.navigation.push('PhotoEditor',{ Eventname: Eventname, uri: Imageuri, bib: bib, hideTabBar: true})}>
      <View style = {{width: windowWidth * 0.205, height: windowWidth * 0.2, borderRadius: windowWidth *0.2 /2, marginBottom: 10}}>
      <LinearGradient
      colors={['#fad961', '#f76b1c']} style = {{flex: 1, borderRadius: windowWidth *0.2 /2, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name = "magic2" size={30} color = '#fff' style = {{paddingTop: 2}}/>
      </LinearGradient>
      </View>
      </TouchableOpacity>
      <Text style = {styles.textEditor}>Photo</Text>
      <Text style = {styles.textEditor}>Editor</Text>
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
          messageStyle = {{fontFamily: Fonts.MosseThai_Medium, textAlign: 'center',
                           color: '#2f3640', fontSize: 15 }}
          titleStyle = {{fontFamily: Fonts.MosseThai_Bold,
                           color: '#7bd834', fontSize: 19 }}
          confirmButtonTextStyle = {{fontFamily: Fonts.MosseThai_Medium, textAlign: 'center',
                           color: '#fff', fontSize: 14 }}
          onConfirmPressed={() => {
            this.AcceptAwesomeAlertDownloadphoto();
          }}
        />

      </View>
        )
    }
    }

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    textEditor:{
        textAlign: 'center', 
        fontFamily: Fonts.MosseThai_Bold,
        fontSize: 15,
        color: '#5a5a5a',
        lineHeight: 18
    },
    textHeader:{
        fontFamily: Fonts.MosseThai_Bold,
        fontSize: 20,
        color: '#5a5a5a',
    },
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'transparent'
    }
    })
