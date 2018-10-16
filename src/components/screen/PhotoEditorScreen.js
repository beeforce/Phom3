import React, { Component } from 'react'
import { 
    Text, 
    StyleSheet, 
    View, 
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    ScrollView,
    Animated,
    TouchableHighlight,
    CameraRoll,
    SafeAreaView,
    Alert
} from 'react-native'
import { Fonts } from '../../utill/Fonts';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import IcoMoonConfig from '../../selection.json';
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import ViewShot, { captureRef } from "react-native-view-shot";
import { ShareDialog } from 'react-native-fbsdk';
import Share from 'react-native-share';
import AwesomeAlert from 'react-native-awesome-alerts'



class CustomToolbar extends Component {
    render() {
    return (
    <View style = {{backgroundColor: '#fff'}}>
    <LinearGradient colors={['#fad961', '#f76b1c']}>
    <SafeAreaView>
    <View style = {{height: 56, justifyContent: 'center'}}>
    <TouchableOpacity onPress={this.props.onBackpress}
    style = {{ position: 'absolute', left: 0, bottom: 0, padding: 15, paddingLeft: 20, paddingRight: 20,}}>
    <Icon
          name="arrow-left"
          size={22}
          color= '#fff'
          style = {{
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 2
          }}
        />
    </TouchableOpacity>
   
    <Text style = {styles.toolbarTitle}>{this.props.title}</Text>
      <TouchableOpacity style = {styles.toolbarBellimage}
      onPress={this.props.nextpagePress}>
      <Text style = {styles.toolbarTitle}>Done</Text>
      </TouchableOpacity>
  </View>

  </SafeAreaView>
  </LinearGradient>
  </View>
    )
  }
}

export default class PhotoEditorScreen extends Component {

    static navigationOptions = {
        header: <View></View>,
      };

    constructor() {
        super();
        this.state = {
          editing: true,
          edited: false,
          activeIndex: 0,
          imageuriShare: '',
          showAlertDownloadphoto: false,
        };
      }

      captureScreen = ()=> {
        captureRef(this.viewshot, {
          format: "jpg",
          quality: 1
        })
        .then(
          uri => {CameraRoll.saveToCameraRoll(uri, 'photo').then(() =>{
            this.showAwesomeAlertDownloadphoto()
          })},
            // console.log("Image saved to", uri)}
          error => console.error("Oops, snapshot failed", error)
        );
      }

      captureScreenForsharing = ()=> {
        captureRef(this.viewshot, {
          format: "jpg",
          quality: 1
        })
        .then(
          uri => {this.shareLinkWithShareDialog(uri)},
        );
      }

      captureScreenForsharingInstragram = ()=> {
        captureRef(this.viewshot, {
          format: "jpg",
          quality: 1,
          result: "base64"
        })
        .then(uri => {
          console.log("uri base 64"+uri)
        //   CameraRoll.saveToCameraRoll(uri, 'photo').then(result => { 
            let shareImageBase64 = {
              url: "data:image/jpeg;base64,"+uri,
          };
          Share.open(shareImageBase64)
        })
      //   const shareOptions = {
      //     title: 'Share via',
      //     url: uri,
      //     social: Share.Social.EMAIL,
      //     type: 'image/jpg'
      // };
      // Share.shareSingle(shareOptions);
         
      //   })
      }

      shareLinkWithShareDialog(uri) {
        let sharePhotoContent  = {
          contentType: 'photo',
          photos: [
            {
              imageUrl: uri,
              userGeneratesd: false,
            }
          ]
        };
        ShareDialog.canShow(sharePhotoContent).then(
          function(canShow) {
            if (canShow) {
              return ShareDialog.show(sharePhotoContent);
            }
          }
        ).then(
          function(result) {
            if (result.isCancelled) {
              Alert.alert(
                "การแชร์ไม่สำเร็จ",
                "การแชร์ถูกยกเลิก",
                [{ text: "OK" }],
                { cancelable: false }
              )
            } else {
              Alert.alert(
                "การแชร์สำเร็จ",
                "การแชร์รูปภาพของคุณสำเร็จ",
                [{ text: "OK" }],
                { cancelable: false }
              )
              // alert('Share success with postId: ' + result.postId);
            }
          },
          function(error) {
            Alert.alert(
              "การแชร์ไม่สำเร็จ",
              error.toString(),
              [{ text: "OK" }],
              { cancelable: false }
            )
          }
        );
      }

      showAwesomeAlertDownloadphoto = () => {
        this.setState({
          showAlertDownloadphoto: true,
        })
      };
    
      AcceptAwesomeAlertDownloadphoto = () =>{
        this.setState({
          showAlertDownloadphoto: false,
        });
      }

    OpenEditedpage = () =>{
        this.setState({
            editing: false,
            edited: true,
          })
    }

    OpenEditingpage = () =>{
        this.setState({
            editing: true,
            edited: false,
          })
    }


    renderSectionImage(Imageuri,Eventname){
        if(this.state.activeIndex == 0 ){
          return (
            <ViewShot style = {{flex:1}} options={{ format: "jpg", quality: 1}} ref={(c) => { this.viewshot = c }} >
            <ImageBackground style = {{flex:1, width: null, height: null, justifyContent: 'space-between'}}
            source= {{uri: Imageuri}}>
            <View style = {{alignSelf: 'flex-start', marginHorizontal: windowWidth * 0.05}}>
                  <Text style = {styles.textimagebackground}>CHIANG MAI</Text>
                  <Icon name = "map-marker-alt2" color = '#fff' size = {35} style = {styles.iconShadow} />
              </View>
              <View style = {{alignSelf: 'flex-start',marginHorizontal: windowWidth * 0.05}}>
                  <Text style = {styles.textimagebackground}>{Eventname}</Text>
                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name = "calendar" color = '#fff' size = {35} style = {styles.iconShadow} />
                  <Text style = {[styles.textimagebackground,{paddingLeft: windowWidth * 0.02, fontSize: 25}]}>เสาร์ 17/07/61</Text>
                  </View>
              </View>
            </ImageBackground>
            </ViewShot>
          )
        }
        else if (this.state.activeIndex == 1){
          return (
            <ViewShot style = {{flex:1}} options={{ format: "jpg", quality: 1}} ref={(c) => { this.viewshot = c }} >
            <ImageBackground style = {{flex:1, width: null, height: null, justifyContent: 'space-between'}}
            source= {{uri: Imageuri}}>
            <View style = {{alignSelf: 'flex-start',marginHorizontal: windowWidth * 0.05}}>
                  <Text style = {styles.textimagebackground}>{Eventname}</Text>
                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name = "calendar" color = '#fff' size = {35} style = {styles.iconShadow} />
                  <Text style = {[styles.textimagebackground,{paddingLeft: windowWidth * 0.02, fontSize: 25}]}>เสาร์ 17/07/61</Text>
                  </View>
              </View>
              <View style = {{alignSelf: 'flex-start',marginHorizontal: windowWidth * 0.05}}>
                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name = "location-arrow2" color = '#fff' size = {35} style = {styles.iconShadow} />
                  <Text style = {[styles.textimagebackground,{paddingLeft: windowWidth * 0.02}]}>1hrs 55 mins</Text>
                  </View>
              </View>
            </ImageBackground>
            </ViewShot>
          )
        }
        else if (this.state.activeIndex == 2){
            return (
              <ViewShot style = {{flex:1}} options={{ format: "jpg", quality: 1}} ref={(c) => { this.viewshot = c }} >
                <ImageBackground style = {{flex:1, width: null, height: null, justifyContent: 'space-between'}}
                source= {{uri: Imageuri}}>
                 <View style = {{alignSelf: 'flex-start', marginHorizontal: windowWidth * 0.05}}>
                  </View>
                   <View style = {{alignSelf: 'flex-start',marginHorizontal: windowWidth * 0.05}}>
                  <Text style = {styles.textimagebackground}>{Eventname}</Text>
                  <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name = "calendar" color = '#fff' size = {35} style = {styles.iconShadow} />
                  <Text style = {[styles.textimagebackground,{paddingLeft: windowWidth * 0.02, fontSize: 25}]}>เสาร์ 17/07/61</Text>
                  </View>
              </View>
                </ImageBackground>
                </ViewShot>
            )
          }
          else if (this.state.activeIndex == 3){
            return (
              <ViewShot style = {{flex:1}} options={{ format: "jpg", quality: 1}} ref={(c) => { this.viewshot = c }} >
                <ImageBackground style = {{flex:1, width: null, height: null, justifyContent: 'space-between'}}
                source= {{uri: Imageuri}}>
                 <View style = {{alignSelf: 'flex-start', marginHorizontal: windowWidth * 0.05}}>
                  </View>
                   <View style = {{alignSelf: 'flex-start',marginHorizontal: windowWidth * 0.05}}>
                      <Text style = {styles.textimagebackground}>{Eventname}</Text>
                      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name = "location-arrow2" color = '#fff' size = {35} style = {styles.iconShadow} />
                       <Text style = {[styles.textimagebackground,{paddingLeft: windowWidth * 0.02}]}>1hrs 55 mins</Text>
                      </View>
                  </View>
                </ImageBackground>
                </ViewShot>
            )
          }
      }
      segmentClick = (index) =>{
        this.setState({
          activeIndex: index
        })
      }

    renderImageEditorList(){
        return (
        <ScrollView
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.scrollX } } }])}
            horizontal
                    >

        <TouchableHighlight underlayColor= 'transparent' onPress = {() => this.segmentClick(0)}>
        <View>
          <View style = {this.state.activeIndex == 0 ? [styles.smallimagesize,{borderColor: '#ffd32a', borderWidth: 2}] : styles.smallimagesize}>
          <View style = {{marginHorizontal: 10}}>
                  <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
                  <Icon name = "map-marker-alt" color = '#2e3030' size = {23} style = {{paddingTop: 2, flex: 1}}/>
                  <View style = {{flex: 2, width: windowWidth*0.48/3, backgroundColor: '#8a8e8e'}} ></View>
                  </View>
            </View>
            
            <View style = {{marginHorizontal: 10}}>
                  <View style = {{flexDirection: 'row'}}>
                  <Icon name = "calendar" color = '#2e3030' size = {23} style = {{paddingTop:2, flex: 1}}/>
                  <View style = {{flex: 2, width: windowWidth*0.48/3, backgroundColor: '#8a8e8e'}} ></View>
                  </View>
            </View>
        </View>
        <Text style = {styles.textTypePhoto}>Joined</Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor= 'transparent' onPress = {() => this.segmentClick(1)}>
        <View>
        <View style = {this.state.activeIndex == 1 ? [styles.smallimagesize,{borderColor: '#ffd32a', borderWidth: 2}] : styles.smallimagesize}>
          <View style = {{marginHorizontal: 10}}>
                  <View style = {{flexDirection: 'row'}}>
                  <Icon name = "calendar" color = '#2e3030' size = {23} style = {{paddingTop: 2, flex: 1}}/>
                  <View style = {{flex: 2, width: windowWidth*0.48/3, backgroundColor: '#8a8e8e'}} ></View>
                  </View>
            </View>
            
            <View style = {{marginHorizontal: 10}}>
                  <View style = {{flexDirection: 'row'}}>
                  <Icon name = "location-arrow2" color = '#2e3030' size = {23} style = {{paddingTop: 2, flex: 1}}/>
                  <View style = {{flex: 2, width: windowWidth*0.48/3, backgroundColor: '#8a8e8e'}} ></View>
                  </View>
            </View>
        </View>
        <Text style = {styles.textTypePhoto}>Goal Time</Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor= 'transparent' onPress = {() => this.segmentClick(2)}>
        <View>
        <View style = {this.state.activeIndex == 2 ? [styles.smallimagesize,{borderColor: '#ffd32a', borderWidth: 2}] : styles.smallimagesize}>
          <View style = {{alignSelf: 'flex-start',marginHorizontal: 10}}>    
            </View>
            
            <View style = {{marginHorizontal: 10}}>
                  <View style = {{flexDirection: 'row'}}>
                  <Icon name = "calendar" color = '#2e3030' size = {23} style = {{paddingTop: 2, flex: 1}}/>
                  <View style = {{flex: 2, width: windowWidth*0.48/3, backgroundColor: '#8a8e8e'}} ></View>
                  </View>
            </View>
        </View>
        <Text style = {styles.textTypePhoto}>Event Only</Text>
        </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor= 'transparent' onPress = {() => this.segmentClick(3)}>
        <View>
        <View style = {this.state.activeIndex == 3 ? [styles.smallimagesize,{borderColor: '#ffd32a', borderWidth: 2}] : styles.smallimagesize}>
          <View style = {{alignSelf: 'flex-start',marginHorizontal: 10}}>
            </View>
            
                        <View style = {{marginHorizontal: 10}}>
                  <View style = {{flexDirection: 'row'}}>
                  <Icon name = "location-arrow2" color = '#2e3030' size = {22} style = {{paddingTop: 2, flex: 1}}/>
                  <View style = {{flex: 2, width: windowWidth*0.48/3, backgroundColor: '#8a8e8e'}} ></View>
                  </View>
            </View>
        </View>
        <Text style = {styles.textTypePhoto}>Goal Time Only</Text>
        </View>
        </TouchableHighlight>

        </ScrollView>
        );
      }

  render() {
    const Eventname = this.props.navigation.getParam('Eventname');
    const Imageuri = this.props.navigation.getParam('uri');
    // const bib = this.props.navigation.getParam('bib');
    const {showAlertDownloadphoto} = this.state;

    return (
      <View style = {styles.container}>
      {this.state.editing ? <CustomToolbar title = {this.props.navigation.getParam('title', '')}
      onBackpress = {() => {this.props.navigation.goBack()}} nextpagePress = {this.OpenEditedpage} /> : null}
      {this.state.edited ? <CustomToolbar title = {this.props.navigation.getParam('title', 'Save & Share')}
      onBackpress = {this.OpenEditingpage} nextpagePress = {() => {this.props.navigation.goBack()}} /> : null}
      
      
      { this.state.editing ? 
      <View style = {{flex: 1}}>
      <View style = {{flex: 11, paddingTop: windowWidth * 0.15}}>
      {this.renderSectionImage(Imageuri,Eventname)}
        
      </View>

      <View style = {{flex: 6.5,justifyContent: 'center',marginTop: windowWidth * 0.07}}>
      {this.renderImageEditorList()}

      </View>
      </View>
      : null }


        { this.state.edited ? 
      <View style = {{flex: 1, backgroundColor: '#fff'}}>
      <View style = {{flex: 10, paddingTop: windowWidth * 0.15}}>
      {this.renderSectionImage(Imageuri,Eventname)}
        
      </View>

      <View style = {{flex: 6.5}}>
      <View style = {{flex:1 , flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: windowWidth * 0.035, justifyContent: 'space-around'}}>
      
      <View>
      <TouchableOpacity onPress = {this.captureScreen} >
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
      <TouchableOpacity 
      onPress = {this.captureScreenForsharing}
       >
      <View style = {{width: windowWidth * 0.205, height: windowWidth * 0.2, borderRadius: windowWidth *0.2 /2, marginBottom: 10}}>
      <LinearGradient
      colors={['#fad961', '#f76b1c']} style = {{flex: 1, borderRadius: windowWidth *0.2 /2, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name = "facebook-square" size={30} color = '#fff' style = {{paddingTop: 2}}/>
      </LinearGradient>
      </View>
      </TouchableOpacity>
      <Text style = {styles.textEditor}>Facebook</Text>
      <Text style = {styles.textEditor}>Share</Text>
      </View>

      <View style = {{alignItems: 'center'}}>
      <TouchableOpacity onPress = {this.captureScreenForsharingInstragram}>
      <View style = {{width: windowWidth * 0.205, height: windowWidth * 0.2, borderRadius: windowWidth *0.2 /2, marginBottom: 10}}>
      <LinearGradient
      colors={['#fad961', '#f76b1c']} style = {{flex: 1, borderRadius: windowWidth *0.2 /2, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name = "share-square" size={28} color = '#fff' style = {{paddingTop: 2}}/>
      </LinearGradient>
      </View>
      </TouchableOpacity>
      <Text style = {styles.textEditor}>Others</Text>
      <Text style = {styles.textEditor}>Share</Text>
      </View>
      

      

      

      </View>
      </View>

      </View>
      : null }
      
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
        backgroundColor: '#2e3030'
    },
      toolbarBellimage: {
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        marginRight: 15, 
        marginBottom: 15, 
      },
      textimagebackground: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 4, 
        fontSize: 30, 
        fontFamily: Fonts.MosseThai_Bold,
        color: '#fff'
      },
      iconShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 4,
        padding: 5
    },
    smallimagesize:{
        height: windowWidth*0.875/3, 
        width: windowWidth*0.875/3,
        justifyContent: 'space-between',
        backgroundColor: '#EEEEEE',
        marginHorizontal: 3,
        paddingVertical: 10
      },
      textTypePhoto:{
          alignSelf: 'center', 
          fontFamily: Fonts.MosseThai_Medium, 
          fontSize: 16,
          color: '#fff'
      },
      textEditor:{
        textAlign: 'center', 
        fontFamily: Fonts.MosseThai_Bold,
        fontSize: 15,
        color: '#5a5a5a',
        lineHeight: 18,
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
})
