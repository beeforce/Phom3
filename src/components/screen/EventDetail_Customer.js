import React, { Component } from 'react'
import {
     Text, 
     View,  
     StyleSheet,  
     TextInput,
     Dimensions,
     Image,
     ScrollView,
     TouchableHighlight,
     Animated,
     Modal,
     ActivityIndicator
} from 'react-native'
import { Fonts } from '../../utill/Fonts';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../selection.json';
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);
import FastImage from 'react-native-fast-image'
import CustomToolbarwithNav from '../styles/CustomToolbarwithNav'
import firebase from "@firebase/app"

class FavoriteIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            EventName: ''
        };
    }

    componentDidMount(){
      const userId = firebase.auth().currentUser.uid;
      this.getuserinformationCurrent(userId, this.props.Eventname)
      
      }

  getuserinformationCurrent = (userId, Eventname) => {
      firebase.database().ref(`User/Detail/${userId}/Favorite/${Eventname}`).on('value', snapshot => {
          let eventName = snapshot.child('title').val()
            this.setState({
              EventName: eventName,
            })
      })
    }

  onPressIcon = (Eventname) => {
    const userId = firebase.auth().currentUser.uid;
    if(this.state.EventName == Eventname){
      firebase.database().ref(`User/Detail/${userId}/Favorite/${Eventname}`).remove().then(()=> {
        this.setState({favorite: false})
      })

    }else {
      let data = {
          title: Eventname,
      }
      firebase.database().ref(`User/Detail/${userId}/Favorite/${Eventname}`).set(data).then(()=> {
        this.setState({favorite: true})
        })
      }
    }


  render() {
    const { EventName } = this.state;
    if(EventName == this.props.EventName){
      return(
        <Icon
        name= 'heart'
        color= '#2c3e50'
        size={23}
        onPress={() => this.onPressIcon(this.props.Eventname)}
        />
      )   
      }   else {
        return (
          <Icon
          name= 'heart2'
          color= 'red'
          size={23}
          onPress={() => this.onPressIcon(this.props.Eventname)}
          />
        )  
      }
  }
}


var ImageList = []

export default class EventDetail_Customer extends Component {
static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
    header: <View></View>
      };
    };

    constructor(props) {
      super(props);
      this.state = {
          arrayImage: [],
          loading: true,
          EventDetail: {}
      };
  }

  componentDidMount(){
    // user id from firebase
    const Eventname = this.props.navigation.getParam('Eventname');
    this.getEventdetail(Eventname)
    this.getImagePost(Eventname)
   
  }

  getEventdetail(Eventname) {
    // const monthNames = ["January", "February", "March", "April", "May", "June",
    // "July", "August", "September", "October", "November", "December"
    // ];
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    firebase.database().ref(`Events/Approve/${Eventname}`).on('value', dataSnapshot => {
          let Eventdata = {}
          let d = new Date(dataSnapshot.child('date').val())
          Eventdata.uri = dataSnapshot.child('eventImageurl').val()
          Eventdata.date = ''+d.getDate()+' '+monthNames[d.getMonth()]+' '+d.getFullYear()
          Eventdata.starttime = dataSnapshot.child('starttime').val()
          Eventdata.finishtime = dataSnapshot.child('finishtime').val()
          Eventdata.title = dataSnapshot.key
          Eventdata.location = dataSnapshot.child('place').val()
      
          this.setState({
            EventDetail: Eventdata,
          });
    });
  }

  getImagePost(Eventname) {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`Photos/${Eventname}`).on('value', (dataSnapshot) => {
      ImageList = []
      let imagelistBought = []
      dataSnapshot.forEach((child) => {
        ImageList.push({
          title: Eventname,
          uri: child.val().uri,
          bib: child.val().bib,
          photographer: child.val().photoGrapherID,
          _key: child.key 
      })
      })
      firebase.database().ref(`User/Photo/${userId}/Bought`).on('value', (dataSnapshot) => {
        imagelistBought = []
        dataSnapshot.forEach((child) => {
          child.forEach((eachchild) => {
          imagelistBought.push({
            _key: eachchild.key
            })
          })
        })
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
          arrayImage: ImageList,
          loading: false
        })
      })
    })
}

    renderImage(item){

      let imagelist = [];
      for(let i = 0; i < item.length; i += 3){
        imagelist.push(
          <View key={i}>
            <View style = {{flexDirection: 'row'}}>
            { item[i] != null ? 
            <TouchableHighlight 
            onPress = {() => this.props.navigation.push('Imagedetail',{ Eventname: item[i].title, bib: item[i].bib, 
            photographer: item[i].photographer, uri: item[i].uri, key: item[i]._key})}>
            <FastImage source= {item[i]} resizeMode={FastImage.resizeMode.cover} 
            style = {styles.smallimagesize} />
            </TouchableHighlight> : null }
            { item[i+1] != null ? 
            <TouchableHighlight 
            onPress = {() => this.props.navigation.push('Imagedetail',{ Eventname: item[i+1].title, bib: item[i+1].bib, 
            photographer: item[i+1].photographer, uri: item[i+1].uri, key: item[i+1]._key})}>
            <FastImage source= {item[i+1]} resizeMode={FastImage.resizeMode.cover} 
            style = {styles.smallimagesize} />
            </TouchableHighlight> : null }
            { item[i+2] != null ?
              <TouchableHighlight 
            onPress = {() => this.props.navigation.push('Imagedetail',{ Eventname: item[i+2].title, bib: item[i+2].bib, 
            photographer: item[i+2].photographer, uri: item[i+2].uri, key: item[i+2]._key})}> 
            <FastImage source= {item[i+2]} resizeMode={FastImage.resizeMode.cover}  
            style = {styles.smallimagesize} />
            </TouchableHighlight> : null }
            </View>

            </View>
        )
      }
      return imagelist
    }

    searchText = (e) => {
      let text = e.toLowerCase()
      let trucks = ImageList
      let filteredName = trucks.filter((item) => {
        return item.bib.toString().match(text)
      })
      if (!text || text === '') {
        this.setState({
          arrayImage: ImageList
        })
      } else if (Array.isArray(filteredName)) {
        this.setState({
          noData: false,
          arrayImage: filteredName
        })
      }
    }

  render() {
    const Eventname = this.props.navigation.getParam('Eventname');
    return (
    <View style = {styles.container}>
    <CustomToolbarwithNav  title = {this.props.navigation.getParam('title', Eventname)} 
    onBackpress = {() => {this.props.navigation.pop(1)}} onBellpress = {() => {this.props.navigation.navigate('notification')}}/>
    <Modal
        transparent={true}
        animationType={'none'}
        visible={this.state.loading}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={this.state.loading}
              size = "small"
              color = '#000' />
          </View>
        </View>
      </Modal>
    <ScrollView
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } }])}
            nestedScrollEnabled>
    <View style = {{ padding:windowWidth * 0.04, borderBottomWidth: 1, borderColor: '#eae5e5'}}>
    <View style = {styles.viewSearchBarbibId}>
      <Icon
          name="search"
          size={18}
          style = {{paddingLeft: 20, padding:2, flex: 0.1}}
        />
      <TextInput style = {styles.TextinputBarbibId}
      onChangeText={(text) => this.searchText(text)}
      underlineColorAndroid="transparent"
      returnKeyType = "done"
      keyboardType = "numeric"
      placeholderTextColor = '#6262621'
      placeholder = "ค้นหาเลข Bib ของคุณที่นี่">
      </TextInput>
      </View>
      </View>

      <View style = {{ paddingHorizontal: windowWidth * 0.06, paddingVertical: windowWidth * 0.04, borderBottomWidth: 1, borderColor: '#eae5e5'}}>
        <View style = {{flexDirection: 'row',justifyContent:'space-between', alignItems: 'baseline'}}>
        <Text style = {styles.titileEvent}>{Eventname}</Text>
        <FavoriteIcon  Eventname = {Eventname}/>
        </View>
        <View style = {{flexDirection: 'row',justifyContent:'flex-start', alignItems: 'baseline', marginTop: 5}}>
        <Icon
          name="clock"
          size={17}
          style = {{padding:2,}}
        />
        <Text style = {styles.eventDetail}>{this.state.EventDetail.date}  {this.state.EventDetail.starttime} - {this.state.EventDetail.finishtime}</Text>
        </View>
        <View style = {{flexDirection: 'row',justifyContent:'flex-start', alignItems: 'baseline'}}>
        <Icon
          name="map-marker-alt2"
          size={17}
          style = {{padding:2, paddingRight: 7}}
        />
        <Text style = {styles.eventDetail}>{this.state.EventDetail.location}</Text>
        </View>
        <View style = {{flexDirection: 'row',justifyContent:'flex-start', alignItems: 'baseline'}}>
        <Icon
          name="tag2"
          size={17}
          style = {{padding:2, paddingRight: 3}}
        />
        <Text style = {styles.eventDetail}>วิ่งมาราธอน</Text>
        </View>
      </View>

       <View style = {{ paddingHorizontal: windowWidth * 0.07, paddingVertical: windowWidth * 0.05, borderBottomColor: '#eae5e5', borderBottomWidth: 1}}>
       <View style = {{flexDirection: 'row',justifyContent:'flex-start'}}>
       <Text style = {[styles.titileEvent,{fontSize: 18}]}>ผู้จัด</Text>
       <View style = {{flexDirection: 'row',justifyContent:'center', alignItems: 'baseline', marginLeft: 25}}>
       <Image source= {{uri: 'https://firebasestorage.googleapis.com/v0/b/test-fb2a3.appspot.com/o/dataImages%2Fcmu.png?alt=media&token=3549a366-6dcf-4c2f-b216-af051e2f28cb'}} style = {{width: 55, height: 55, borderRadius: 30, marginRight: 7}} />
       <Image source= {{uri: 'https://firebasestorage.googleapis.com/v0/b/test-fb2a3.appspot.com/o/dataImages%2Faia.png?alt=media&token=217ecc1e-1f8d-4e61-a722-a441482c9464'}} style = {{width: 55, height: 55, borderRadius: 30}} />
       </View>
       </View>
       </View>

      {this.renderImage(this.state.arrayImage)}

      </ScrollView>
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
      goBackButton: { 
        position: 'absolute', 
        left: 0, 
        bottom: 0, 
        padding: 15, 
        paddingLeft: 15, 
        paddingRight: 15,
    },
    viewSearchBarbibId:{
        flexDirection:'row', 
        alignItems:'center',
        backgroundColor: '#e2e2e2',
        borderRadius: 5,
        paddingVertical: 10,
        marginBottom: 5
    },
    TextinputBarbibId:{
        flex: 1,
        fontSize: 16,
        fontFamily: Fonts.MosseThai_Medium,
        color: '#000',
    },
    titileEvent:{
        fontSize: 18,
        fontFamily: Fonts.MosseThai_Bold,
        color: '#000'
    },
    eventDetail:{
        fontSize: 14,
        fontFamily: Fonts.MosseThai_Medium,
        color: '#000',
        paddingLeft: 7
    },
    smallimagesize:{
      height: windowWidth*1/3, 
      width: windowWidth*1/3, 
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
   
  })