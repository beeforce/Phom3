import React, { Component } from 'react';
import {
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Animated, 
  Dimensions, 
  TouchableHighlight, 
  Modal,
  ActivityIndicator
 } from 'react-native';
import { Fonts } from '../../utill/Fonts';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../selection.json'; 
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import CustomToolbarwithNav from '../styles/CustomToolbarwithNav'
import FastImage from 'react-native-fast-image';
import { TextMask } from 'react-native-masked-text'
import firebase from "@firebase/app"



var ImageList = []

export default class Userprofile extends Component {
    static navigationOptions = () => {
        return {
          header: <View></View>,
        };
      };

      constructor(props) {
        super(props);
        this.state = {
          loading: true,
          userProfile: {
            name: '',
            imageprofileuri: null,
            imagePost: 0,
            eventJoin: 0,
            imagesoldout: 0,
            userImagePost: [],
          }
        };
      } 

      componentDidMount(){
            const photographer = this.props.navigation.getParam('photographer');
            this.getUserdetail(photographer)
            this.getImagePost(photographer)
        }

        // componentWillUnmount(){
        //   userprofile = {
        //     name: null,
        //     imageprofileuri: null,
        //     imagePost: 0,
        //     eventJoin: 0,
        //     imagesoldout: 0,
        //     userImagePost: [],
        //   }
        // }

        getUserdetail = (userId) => {
          firebase.database().ref(`User/Detail/${userId}`).on('value', snapshot=> {
            firebase.database().ref(`User/Photo/${userId}/Post`).on('value', (dataSnapshot) => {
              let ImageList = []
              let EventList = []
              let ImageListSold = []
              dataSnapshot.forEach((child) => {
                child.forEach((eachchild) => {
                  ImageList.push({
                    _key: eachchild.key
                  });
                })
              })
      
              firebase.database().ref(`User/Photo/${userId}/Sold`).on('value', (user) => {
                ImageListSold = []
                user.forEach((dataSnapshot) => {
                dataSnapshot.forEach((child) => {
                  child.forEach((eachchild) => {
                    ImageListSold.push({
                      _key: eachchild.key
                    });
                  })
                })
              })
      
              firebase.database().ref(`User/Photo/${userId}/Post`).on('value', (dataSnapshot) => {
                dataSnapshot.forEach((child) => {
                    EventList.push({
                      title: child.key
                  })
                })
                let Userprofile = {}
                Userprofile.name = snapshot.child('Name').val()
                Userprofile.imageprofileuri = snapshot.child('PhotoURL').val()
                Userprofile.imagePost = ImageList.length
                Userprofile.eventJoin = EventList.length
                Userprofile.imagesoldout = ImageListSold.length
        
                this.setState({
                  userProfile: Userprofile,
                });
              })
            })
          })
        })
      }

      
        // getUserdetail = (userId) => {
        //   firebase.database().ref(`User/Detail/${userId}`).on('value', snapshot => {
        //     userprofile.name = snapshot.child('Name').val()
        //     userprofile.imageprofileuri = snapshot.child('PhotoURL').val()
        
        //     firebase.database().ref(`User/Photo/${userId}`).on('value', snapshot => {
        //       userprofile.imagePost = snapshot.child('imagePost').val()
        //       userprofile.eventJoin = snapshot.child('eventJoin').val()
        //       userprofile.imagesoldout = snapshot.child('imagesoldout').val()
        
        //       this.setState({
        //         userProfile: userprofile,
        //       });
        //       })
        //     })
        // }

        
      
        getImagePost(userId) {
          const currentUserId = firebase.auth().currentUser.uid;

          firebase.database().ref(`User/Photo/${currentUserId}/Bought`).on('value', (dataSnapshot) => {
            let imagelistBought = []
            ImageList = []
            dataSnapshot.forEach((child) => {
              child.forEach((eachchild) => {
              imagelistBought.push({
                _key: eachchild.key
                })
              })
            })
            firebase.database().ref(`User/Photo/${userId}/Post`).on('value', (dataSnapshot) => {
              ImageList = []
              dataSnapshot.forEach((child) => {
                child.forEach((eachchild) => {
                  ImageList.push({
                    title: child.key,
                    uri: eachchild.val().uri,
                    bib: eachchild.val().bib,
                    photographer: eachchild.val().photoGrapherID,
                    _key: eachchild.key
                  });
                })
              });
              imagelistBought.forEach((each) => {
                ImageList.forEach((child) => {
                  if(each._key == child._key){
                    let i = ImageList.indexOf(child)
                    ImageList.splice(i, 1);
                  }
                })
              })
              console.log(ImageList)
              this.setState({
                userImagePost: ImageList,
                loading: false
              });
            });
          })
          // firebase.database().ref(`User/Photo/${userId}/Post`).on('value', (dataSnapshot) => {
          //   ImageList = []
          //   dataSnapshot.forEach((child) => {
          //     child.forEach((eachchild) => {
          //       ImageList.push({
          //         title: child.key,
          //         uri: eachchild.val().uri,
          //         bib: eachchild.val().bib,
          //         photographer: eachchild.val().photoGrapherID,
          //         _key: eachchild.key
          //       });
          //     })
          //   });
          //   this.setState({
          //     userImagePost: ImageList,
          //     loading: false
          //   });
          // });
      }


      renderImage(item){
        var imagelist = [];
        for(let i = 0; i < item.length; i += 3){ 
          imagelist.push(
            <View key={i}>
              <View style = {{flexDirection: 'row'}}>
              { item[i] != null ? 
              <TouchableHighlight 
              onPress = {() => this.props.navigation.push('Imagedetail',{ Eventname: item[i].title, 
              bib: item[i].bib, photographer: item[i].photographer, uri: item[i].uri, key: item[i]._key})}>
              <FastImage source= {item[i]} resizeMode={FastImage.resizeMode.cover} 
              style = {styles.smallimagesize} />
              </TouchableHighlight> : null }
              { item[i+1] != null ? 
              <TouchableHighlight 
              onPress = {() => this.props.navigation.push('Imagedetail',{ Eventname: item[i+1].title, 
              bib: item[i+1].bib, photographer: item[i+1].photographer, uri: item[i+1].uri, key: item[i+1]._key})}>
              <FastImage source= {item[i+1]} resizeMode={FastImage.resizeMode.cover} 
              style = {styles.smallimagesize} />
              </TouchableHighlight> : null }
              { item[i+2] != null ?
                <TouchableHighlight 
              onPress = {() => this.props.navigation.push('Imagedetail',{ Eventname: item[i+2].title, 
              bib: item[i+2].bib, photographer: item[i+2].photographer, uri: item[i+2].uri, key: item[i+2]._key})}> 
              <FastImage source= {item[i+2]} resizeMode={FastImage.resizeMode.cover}  
              style = {styles.smallimagesize} />
              </TouchableHighlight> : null }
              </View>
  
              </View>
          )
        }
        return imagelist
    }
    
    
    
      render() {
        return (
          <View style={styles.container}>
          <CustomToolbarwithNav title = {this.props.navigation.getParam('title', this.state.userProfile.name)}
            onBackpress = {() => {this.props.navigation.goBack()}} onBellpress = {() => {this.props.navigation.push('notification')}}/>

            <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.loading}
            onRequestClose={() => {console.log('close modal')}}>
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={this.state.loading}
                  size = 'small'
                  color = '#000' />
              </View>
            </View>
          </Modal>

          <ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.scrollY } } }])}  >
                <View style = {{padding: windowWidth * 0.05, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eae5e5'}}>
                <View style={ styles.profileImage }>
                {this.state.userProfile.imageprofileuri != null ? <FastImage source={{ uri:this.state.userProfile.imageprofileuri }} style={ styles.profileImage } resizeMode='cover' />
                : null }
                </View>
    
                <View style = {{flex:3}}>
                  <Text style = {{ fontFamily: Fonts.MosseThai_Extra_Bold, fontSize: 18}}>{this.state.userProfile.name}</Text>
                  <View style = {{flexDirection:'row', borderBottomWidth: 1, paddingVertical: 5, borderBottomColor: '#eae5e5'}}>
                  <TextMask
                  value= {this.state.userProfile.imagePost != null ? ''+this.state.userProfile.imagePost : 0}
                  type={'only-numbers'}
                  style = {styles.amountText} />
                  <TextMask
                  value= {this.state.userProfile.eventJoin != null ? ''+this.state.userProfile.eventJoin : 0}
                  type={'only-numbers'} 
                  style = {[styles.amountText,{textAlign: 'center'}]} />
                  <TextMask
                  value= {this.state.userProfile.imagesoldout != null ? ''+this.state.userProfile.imagesoldout : 0}
                  type={'only-numbers'}
                  style = {[styles.amountText,{textAlign: 'right'}]} />
                  {/* <Text style = {styles.amountText}>{Userprofile.imagePost}</Text> */}
                  {/* <Text style = {[styles.amountText,{textAlign: 'center'}]}>{Userprofile.eventJoin}</Text>
                  <Text style = {[styles.amountText,{textAlign: 'right'}]}>{Userprofile.imagesoldout}</Text> */}
                  </View>
                  <View style = {{flexDirection: 'row', justifyContent:'space-between', paddingVertical: 3}}>
                  <Text style = {styles.imagejobtext}>รูปถ่าย</Text>
                  <Text style = {styles.imagejobtext}>งานที่เข้า</Text>
                  <Text style = {styles.imagejobtext}>ขายแล้ว</Text>
                  </View>
                </View>
              </View>
    
               <View>
                {this.renderImage(ImageList)}
                </View>
    
              </ScrollView>
            </View>
        );
      }
    }
    
    
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
      },
      profileImage:{
        flex: 2,
        width:windowWidth* 0.22,
        height:windowWidth* 0.22,
        borderRadius:(windowWidth* 0.22)/2,
      },
      amountText:{
        flex: 1,
        fontFamily: Fonts.MosseThai_Extra_Bold,
        fontSize: 16,
      },
      imagejobtext:{
        fontFamily: Fonts.MosseThai_Regular,
        fontSize: 13,
        textAlign: 'center'
      },
      smallimagesize:{
        height: windowWidth*1/3, width: windowWidth*1/3,
        transform: [{ scale: 1 }]
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
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'transparent'
      }
    
    });
    
