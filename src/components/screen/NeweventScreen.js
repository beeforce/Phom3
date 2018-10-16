import React, { Component } from 'react'
import { 
    Text, 
    StyleSheet, 
    View,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Animated, 
    ScrollView,
    TouchableHighlight,
    Platform,
    Modal,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Alert
} from 'react-native'
import { Fonts } from '../../utill/Fonts';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import IcoMoonConfig from '../../selection.json';
import { TextInputMask } from 'react-native-masked-text'
import RNFetchBlob from 'rn-fetch-blob'
import firebase from "@firebase/app"
const Icon = createIconSetFromIcoMoon(IcoMoonConfig)
import AwesomeAlert from 'react-native-awesome-alerts'
import DateTimePicker from 'react-native-modal-datetime-picker';
var ImagePicker = require('react-native-image-picker');
import ImageBackground from '../styles/ImageBackground'
 
// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
// const storage = firebase.storage()


class CustomToolbar extends Component {
    render() {
    return (
        <View style = {{backgroundColor: '#fff'}}>
        <LinearGradient colors={['#fad961', '#f76b1c']}>
        <SafeAreaView>
        <View style = {{height: 56, justifyContent: 'center'}}>
        <TouchableOpacity onPress={this.props.onBackpress}
        style = {{ position: 'absolute', left: 0, bottom: 0, padding: 15, paddingLeft: 20, paddingRight: 20,}}
        >
        <Icon
            name="arrow-left"
            size={22}
            color= '#fff'
            style = {{
                textShadowColor: "rgba(0, 0, 0, 0.75)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2
            }}
            />
        </TouchableOpacity>

        <Text style = {styles.toolbarTitle}>{this.props.title}</Text>
        </View>
        
        </SafeAreaView>
        </LinearGradient>
        </View>
    )
}
}

export default class NeweventScreen extends Component {
  static navigationOptions = () => {
    return {
    header: <View></View>
  };
};

    constructor(props) {
        super(props);
        this.state = {
            pickImage: false,
            loading: false,
            Eventname:'',
            date: '',
            starttime: '',
            finishtime: '',
            place: '',
            link: '',
            imageEventuri: '',
            showAlert: false,
            isDateTimePickerVisible: false,
            isStartimePicker: false,
            isFinishtimePicker: false
        }
      }

      imagePicker = () =>{
        ImagePicker.launchImageLibrary(options, (response) => {
    
          if (response.didCancel) {
          }
          else if (response.error) {
          }
          else if (response.customButton) {
          }
          else {
            // let source = { uri: response.uri };
            this.setState({
                imageEventuri: response.uri,
                pickImage: true
            })
          }
        })
      }

      renderEventImage(){
        return (
          <View style = {styles.viewImagebackgroundOverlay}>
          <TouchableHighlight underlayColor = '#c9c9c9' onPress = {this.imagePicker}>
               <ImageBackground style = {styles.ImagebackgroundOverlay}
               source= {{uri: this.state.imageEventuri}} imageStyle={{ borderRadius: 10 }}>
                  </ImageBackground>
                  </TouchableHighlight>
              </View>
        );
      }

      uploadImage(uri, name, mime = 'image/jpg') {
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob
          if(this.state.Eventname != '' && this.state.date != '' && this.state.finishtime != '' && 
            this.state.starttime != ''  && this.state.place != '' && uri != ''){
                this.setState({
                    loading: true,
                  });
                return new Promise((resolve, reject) => {
        
                    
                      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
                      let uploadBlob = null
                      const sessionId = new Date().toLocaleString({ timeZone: 'Asia' })
                        
                      const imageRef = firebase.storage().ref('images/events').child(name+'_'+sessionId+'.jpg')
                
                      fs.readFile(uploadUri, 'base64')
                        .then((data) => {
                          return Blob.build(data, { type: `${mime};BASE64` })
                        })
                        .then((blob) => {
                          uploadBlob = blob
                          return imageRef.put(blob, { contentType: mime })
                        })
                        .then(() => {
                          uploadBlob.close()
                          return imageRef.getDownloadURL()
                        })
                        .then((url) => {
                          resolve(url)
                          this.storeEventReference(url)
                        })
                        .catch((error) => {
                          reject(error)
                      })
                    })
          }
          else{
            Alert.alert('ไม่สำเร็จ','โปรดป้อนข้อมูลให้ครบ', [{text: 'OK'}], { cancelable: false });
        }
      }

      storeEventReference = (downloadUrl) => {
          let currentUser = firebase.auth().currentUser
        //   if(this.state.link != ''){
        //     let data = {
        //         title: this.state.Eventname,
        //         eventImageurl: downloadUrl,
        //         starttime: this.state.starttime,
        //         finishtime: this.state.finishtime,
        //         date: this.state.date,
        //         place: this.state.place,
        //         link: this.state.link,
        //         creator: currentUser.uid,
        //     }
        //     firebase.database().ref('Events/waitForApprove').push(data).then(()=> {
        //         this.setState({
        //             loading: false,
        //           });
        //         this.props.navigation.goBack()})
        //   }else {
        //     let data = {
        //         title: this.state.Eventname,
        //         eventImageurl: downloadUrl,
        //         starttime: this.state.starttime,
        //         finishtime: this.state.finishtime,
        //         date: this.state.date,
        //         place: this.state.place,
        //         creator: currentUser.uid,
        //     }
        //     firebase.database().ref('Events/waitForApprove').push(data).then(()=> {
        //         this.setState({
        //             loading: false,
        //           });
        //         this.props.navigation.goBack()})
        //   }
        if(this.state.link != ''){
            let data = {
                date: this.state.date,
                eventImageurl: downloadUrl,
                starttime: this.state.starttime,
                finishtime: this.state.finishtime,
                place: this.state.place,
                views: 0,
                link: this.state.link,
            }
            firebase.database().ref(`Events/Approve/${this.state.Eventname}`).set(data).then(()=> {
                this.setState({
                    loading: false,
                  });
                  this.showAlert()
            })
          }else {
            let data = {
                date: this.state.date,
                eventImageurl: downloadUrl,
                starttime: this.state.starttime,
                finishtime: this.state.finishtime,
                place: this.state.place,
                views: 0,
            }
            firebase.database().ref(`Events/Approve/${this.state.Eventname}`).set(data).then(()=> {
                this.setState({
                    loading: false,
                  });
                  this.showAlert()
            })
          }
      }

    showAlert = () => {
        this.setState({
        showAlert: true,
        });
    };

    hideAlert = () => {
        this.setState({
        showAlert: false
        });
        this.props.navigation.goBack()
    };
    _showDateTimePicker = () =>  {
      this.setState({ isDateTimePickerVisible: true })
      
    }

    _hideDateTimePicker = () => { 
        this.setState({ isDateTimePickerVisible: false })
    }

    _handleDatePicked = (date) => {
      this.setState({
          dateTI: date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear(),
          date: (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear(),
          isDateTimePickerVisible: false 
      })
    };

    _showStartTimePicker = () =>  {
        this.setState({ isStartimePicker: true })
        
      }
  
    _hideStartTimePicker = () => { 
          this.setState({ isStartimePicker: false })
      }
  
    _handleStartTimePicked = (time) => {
        if(time.getMinutes() > 9){
            this.setState({
                starttime: time.getHours()+":"+time.getMinutes(),
                isStartimePicker: false 
            })
        }else{
            this.setState({
                starttime: time.getHours()+":0"+time.getMinutes(),
                isStartimePicker: false 
            })
        }
        
      };
    _showFinishTimePicker = () =>  {
        this.setState({ isFinishtimePicker: true })
        
      }
  
    _hideFinishTimePicker = () => { 
          this.setState({ isFinishtimePicker: false })
      }
  
    _handleFinishTimePicked = (time) => {
        if(time.getMinutes() > 9){
            this.setState({
                finishtime: time.getHours()+":"+time.getMinutes(),
                isFinishtimePicker: false 
            })
        }else{
            this.setState({
                finishtime: time.getHours()+":0"+time.getMinutes(),
                isFinishtimePicker: false 
            })
        }
        
      };


    render() {
        const {showAlert} = this.state;
        return (
        <View style = {styles.container}>
        <CustomToolbar title = {this.props.navigation.getParam('title', 'New Event')}
        onBackpress = {() => {this.props.navigation.goBack()}} nextpagePress = {this.OpenEditedpage} />

        <Modal
        transparent={true}
        animationType={'none'}
        visible={this.state.loading}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={this.state.loading} />
          </View>
        </View>
      </Modal>

          <KeyboardAvoidingView style = {{flex: 1}} behavior='padding'>
        <ScrollView>
            <View style = {{flex: 1, margin: windowWidth * 0.07}}>

            <View style = {styles.vieweachinput}>
            <Text style = {styles.textheaderinput}>ชื่องาน Event ที่ต้องการสร้างใหม่</Text>
            <View style = {styles.textinputView}>
            <TextInput style = {styles.textheaderinput}
            returnKeyType = "next"
            underlineColorAndroid="transparent"
            placeholderTextColor = "#4a4a4a"
            placeholder = "ยังไม่ได้ระบุ"
            onChangeText={(Eventname) => this.setState({Eventname})}
            onSubmitEditing = {() => this._showDateTimePicker()}
            value= {this.state.Eventname}
            />

            </View>
            </View>

            <View style = {styles.vieweachinput}>
            <Text style = {styles.textheaderinput}>วันที่</Text>
            <TouchableOpacity onPress = {() => {
              this._showDateTimePicker()
            }}
            style = {[styles.textinputView, {flexDirection: 'row', justifyContent: 'center'}]}>
            <View style = {{flex: 0.1, justifyContent: 'center'}}>
            <Icon name="calendar" size={17} color= '#626262' style = {{paddingTop: 2, alignSelf: 'center'}}/>
            </View>
            {/* <TextInput style = {[styles.textheaderinput,{fontSize: 14, fontFamily: Fonts.MosseThai_Medium}]}
            underlineColorAndroid='transparent'
            placeholder = "ยังไม่ได้ระบุ"
            returnKeyType = "next"
            onChangeText={(date) => this.setState({date})}
            ref = {(input) => this.date = input}
            onSubmitEditing = {() => this.starttime.focus()}
            /> */}
            {/* <TextInput
				 refInput={(ref) => this.date = ref}
                 underlineColorAndroid='transparent'
                 editable = {false}
                returnKeyType = "next"
                keyboardType = "numeric"
                placeholder = "เดือน / วันที่ / ปี ค.ศ."
                // onSubmitEditing = {() => this.starttime.focus()}
				// type={'datetime'}
                // options={{
                //     format: 'MM/DD/YYYY'
                // }}
                style = {[styles.textheaderinput,{fontSize: 14, fontFamily: Fonts.MosseThai_Medium}]}
                // onChangeText={(date) => this.setState({date})}
                value= {this.state.dateTI}
			/> */}
              { this.state.date === '' ? 
            <Text style = {[styles.textheaderinput,{color: '#4a4a4a', fontSize: 14, fontFamily: Fonts.MosseThai_Medium}]}>วัน/เดือน/ปี ค.ศ.</Text> :
            <Text style = {styles.textheaderinput}>{this.state.dateTI}</Text> }

            </TouchableOpacity>
            </View>

            <View style = {[styles.vieweachinput,{flexDirection: 'row'}]}>
            <View style = {{flex:1}}>
            <Text style = {styles.textheaderinput}>เวลาที่เริ่ม</Text>
            <TouchableOpacity onPress = {() => {
              this._showStartTimePicker()
            }}
            style = {styles.textinputView}>
            {/* <TextInputMask
				 refInput={(ref) => this.starttime = ref}
                 underlineColorAndroid='transparent'
                returnKeyType = "next"
                keyboardType = "numeric"
                placeholder = "ชั่วโมง:นาที"
                // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                // ref = {(input) => this.place = input}
                onSubmitEditing = {() => this.finishtime.focus()}
				type={'datetime'}
                options={{
                    format: 'HH.mm'
                }}
                style = {[styles.textheaderinput,{fontSize: 14, fontFamily: Fonts.MosseThai_Medium}]}
                onChangeText={(starttime) => this.setState({starttime})}
                value= {this.state.starttime}
			/> */}
           { this.state.starttime === '' ? 
            <Text style = {[styles.textheaderinput,{color: '#4a4a4a', fontSize: 14, fontFamily: Fonts.MosseThai_Medium}]}>ชั่วโมง:นาที</Text> :
            <Text style = {styles.textheaderinput}>{this.state.starttime}</Text> }

            </TouchableOpacity>
            </View>
            <View style = {{flex:0.3}}></View>
            <View style = {{flex:1}}>
            <Text style = {styles.textheaderinput}>เวลาที่สิ้นสุด</Text>
            {/* <View style = {styles.textinputView}> */}
            <TouchableOpacity onPress = {() => {
              this._showFinishTimePicker()
            }}
            style = {styles.textinputView}>
            {/* <TextInputMask
				 refInput={(ref) => this.finishtime = ref}
                 underlineColorAndroid='transparent'
                returnKeyType = "next"
                keyboardType = "numeric"
                placeholder = "ชั่วโมง : นาที"
                // onChangeText={(creditcardNumber) => this.setState({creditcardNumber})}
                // ref = {(input) => this.place = input}
                onSubmitEditing = {() => this.place.focus()}
				type={'datetime'}
                options={{
                    format: 'HH.mm'
                }}
                style = {[styles.textheaderinput,{fontSize: 14, fontFamily: Fonts.MosseThai_Medium}]}
                onChangeText={(finishtime) => this.setState({finishtime})}
                value= {this.state.finishtime}
            /> */}
             { this.state.finishtime === '' ? 
            <Text style = {[styles.textheaderinput,{color: '#4a4a4a', fontSize: 14, fontFamily: Fonts.MosseThai_Medium}]}>ชั่วโมง:นาที</Text> :
            <Text style = {styles.textheaderinput}>{this.state.finishtime}</Text> }
            </TouchableOpacity>
            </View>
            </View>

            <View style = {styles.vieweachinput}>
            <Text style = {styles.textheaderinput}>สถานที่จัดงาน</Text>
            <View style = {[styles.textinputView, {flexDirection: 'row', justifyContent: 'center'}]}>
            <View style = {{flex: 0.1, justifyContent: 'center'}}>
            <Icon name="map-marker-alt2" size={17} color= '#626262' style = {{paddingTop: 2, alignSelf: 'center'}}/>
            </View>
            <TextInput style = {styles.textheaderinput}
            underlineColorAndroid='transparent'
            placeholderTextColor = "#4a4a4a"
            placeholder = "ยังไม่ได้ระบุ"
            returnKeyType = "next"
            onChangeText={(place) => this.setState({place})}
            ref = {(input) => this.place = input}
            onSubmitEditing = {() => this.link.focus()}
            value= {this.state.place}
            />

            </View>
            </View>

            <View style = {styles.vieweachinput}>
            <Text style = {styles.textheaderinput}>ลิงค์สมัครงาน (ถ้ามี)</Text>
            <View style = {styles.textinputView}>
            <TextInput style = {styles.textheaderinput}
            underlineColorAndroid='transparent'
            placeholderTextColor = "#4a4a4a"
            placeholder = "ยังไม่ได้ระบุ"
            returnKeyType = "done"
            onChangeText={(link) => this.setState({link})}
            ref = {(input) => this.link = input}   
            value= {this.state.link}         />
            </View>
            </View>

            <View>
            <Text style = {styles.textheaderinput}>อัพโหลดภาพ โปสเตอร์ของงาน</Text>
            <View>
            {this.state.pickImage === false ? <TouchableOpacity style={ styles.addImageButton } onPress = {this.imagePicker}> 
            <Icon name="plus" size={19} color= '#fff'/>
            </TouchableOpacity> : this.renderEventImage() }
            </View>
            </View>

            <View style = {{height: windowHeight * (1.5/10)}}>
            <View style = {{flex: 1}}></View>
            <TouchableOpacity style = {{flex: 2,  justifyContent: 'center'}}
            onPress = {() => this.uploadImage(this.state.imageEventuri, this.state.Eventname)} >
            <LinearGradient colors={['#fad961', '#f76b1c']} style = {{flex: 1, justifyContent: 'center', borderRadius: 25,}}>
                <Text style ={styles.textButtonSubmit}>ส่งคำขอสร้าง Event ใหม่</Text>
            </LinearGradient>
            </TouchableOpacity>
            <View style = {{flex: 1}}></View>
            </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>

        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          titleIOS = "วันที่"
          titleStyle = {{fontFamily: Fonts.MosseThai_Bold, 
            color: '#000', 
            fontSize: 16,}}        />

        <DateTimePicker
          isVisible={this.state.isStartimePicker}
          onConfirm={this._handleStartTimePicked}
          onCancel={this._hideStartTimePicker}
          mode = "time"
          titleIOS = "เวลาที่เริ่ม"
          titleStyle = {{fontFamily: Fonts.MosseThai_Bold, 
            color: '#000', 
            fontSize: 16,}}
        />

        <DateTimePicker
          isVisible={this.state.isFinishtimePicker}
          onConfirm={this._handleFinishTimePicked}
          onCancel={this._hideFinishTimePicker}
          mode = "time"
          titleIOS = "เวลาที่สิ้นสุด"
          titleStyle = {{fontFamily: Fonts.MosseThai_Bold, 
            color: '#000', 
            fontSize: 16,}}

        />

         <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="สำเร็จ !"
          message="การขอสร้างกิจกรรมของคุณสำเร็จแล้ว โปรดรอการอนุมัติจากแอดมิน"
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
            this.hideAlert();
          }}
        />

        </View>
        )
        }
    }

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    toolbarTitle:{
        fontSize: 18,
        fontFamily: Fonts.MosseThai_Bold,
        color: '#fff',
        alignSelf: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2
    },
    textinputView: {
        flex:2, 
        borderWidth: 1, 
        borderColor: '#eae5e5',
        borderRadius: 10,
        paddingLeft: 10,
        paddingVertical: 10
    },
    vieweachinput:{
        marginBottom: 10
    },
    textButtonSubmit:{
        fontFamily: Fonts.MosseThai_Bold, 
        color: '#fff', 
        fontSize: 17, 
        alignSelf: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2
    },
    textheaderinput:{
        flex: 1,
        fontFamily: Fonts.MosseThai_Bold, 
        color: '#000', 
        fontSize: 15,
        paddingLeft: 10
    },
    addImageButton:{
        width:windowWidth* 0.12,
        height:windowWidth* 0.12,
        borderRadius:(windowWidth* 0.12)/2,
        backgroundColor: '#F5A623',
        alignItems: 'center',
        justifyContent: 'center'
      },
    viewImagebackgroundOverlay: {
        flex: 1,
        height: null,
        width: null, 
        borderRadius: 10,
        marginTop: 10
    },
    ImagebackgroundOverlay: {
        borderRadius: 10, 
        height: windowWidth * 0.5,
        width: null
      },
      modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
      },
      activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }

})
