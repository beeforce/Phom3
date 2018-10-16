import React, { Component } from 'react'
import { 
  Text, 
  StyleSheet, 
  View, 
  Dimensions, 
  Animated, 
  ScrollView, 
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import CustomToolbarwithNav from '../styles/CustomToolbarwithNav';
import { TextMask } from 'react-native-masked-text';
import { Fonts } from '../../utill/Fonts';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../selection.json'; 
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);


const dataTips = [
  {id: "1", type: 'transferSuccess',
  title: 'กสิกรไทย *4852', date: '18:00:00 09/20/18'},
  {id: "2", type: 'requestTransfer',
  title: 'กสิกรไทย *4852', date: '18:00:00 09/20/18'},
  {id: "3", type: 'cancelRequest',
  title: 'กสิกรไทย *4852', date: '18:00:00 09/20/18'},
  {id: "4", type: 'error',
  title: 'กสิกรไทย *4852', date: '18:00:00 09/20/18'},
]

export default class SaleScreen extends Component {
    static navigationOptions = () => {
        return {
        header: <View></View>
      };
    };


    getImageTypeTips = (type) => {
      switch (type) {
        case "transferSuccess":
            return (<View 
            style = {styles.buttontype}>
            <Icon name='check' size={15} color = '#fff'/>
            </View>)
        case "requestTransfer":
        return (<View 
            style = {[styles.buttontype,{backgroundColor: '#F5A623'}]}>
             <Icon name = 'comment-dots' size={15} color = '#fff'/>
            </View>)
        case "cancelRequest":
        return (<View
            style = {[styles.buttontype,{backgroundColor: '#d60842'}]}>
            <Icon name = 'times'size={15} color = '#fff'/>
            </View>)
        case "error":
        return (<View
            style = {[styles.buttontype,{backgroundColor: '#d60842'}]}>
            <Icon name = 'times' size={15} color = '#fff'/>
            </View>)
      }
    }

    gettextHistory = (type, title) => {
      switch (type) {
        case "transferSuccess":
            return ( <View>
              <Text style = {{ color:'#484848', fontSize: 15, fontFamily: Fonts.MosseThai_Bold}}>โอนเงินเรียบร้อยแล้ว</Text>
              <Text style = {{ color:'#484848', fontSize: 12, fontFamily: Fonts.MosseThai_Regular, lineHeight: 16}}>{title}</Text>
              </View>)
        case "requestTransfer":
            return (<View>
              <Text style = {{ color:'#484848', fontSize: 15, fontFamily: Fonts.MosseThai_Bold}}>ร้องขอการรับเงิน</Text>
              <Text style = {{ color:'#484848', fontSize: 12, fontFamily: Fonts.MosseThai_Regular, lineHeight: 16}}>{title}</Text>
          </View>)
        case "cancelRequest":
            return (<View>
              <Text style = {{ color:'#484848', fontSize: 15, fontFamily: Fonts.MosseThai_Bold}}>ปฏิเสธ/ไม่สามารถทำรายการได้</Text>
              <Text style = {{ color:'#484848', fontSize: 12, fontFamily: Fonts.MosseThai_Regular, lineHeight: 16}}>{title}</Text>
          </View>)
        case "error":
            return (<View>
              <Text style = {{ color:'#484848', fontSize: 15, fontFamily: Fonts.MosseThai_Bold}}>ยกเลิกการร้องขอรับเงิน</Text>
              <Text style = {{ color:'#484848', fontSize: 12, fontFamily: Fonts.MosseThai_Regular, lineHeight: 16}}>{title}</Text>
          </View>)
      }
    }


    renderHistorySection(item){
      var HistoryList = [];
      for(let i = 0; i < item.length; i += 2){
        HistoryList.push(
          <View key={i}>
            { item[i] != null ? 
            <View style = {{ flex: 1, flexDirection: 'row', justifyContent: 'center', 
            paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#fcf2e3', alignItems: 'center'}} >
          
            <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {this.getImageTypeTips(item[i].type)}
            </View>
            
            <View style = {{flex: 4.5, marginHorizontal: 10}}>
            {this.gettextHistory(item[i].type, item[i].title)}
            </View>
            
            <View style = {{flex: 1}}>
            <Text style = {{color:'#484848', fontSize: 10, alignSelf:'center', fontFamily: Fonts.MosseThai_Regular, lineHeight: 12}}>{item[i].date}</Text>
            </View>
          
            </View>
             : null }
            { item[i+1] != null ? 
            <View style = {{ flex: 1, flexDirection: 'row', justifyContent: 'center', 
            paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#ffecce', alignItems: 'center'}} >
          
            <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {this.getImageTypeTips(item[i+1].type)}
            </View>

            <View style = {{flex: 4.5, marginHorizontal: 10}}>
            {this.gettextHistory(item[i+1].type, item[i+1].title)}
            </View>
            
            <View style = {{flex: 1}}>
            <Text style = {{color:'#484848', fontSize: 10, alignSelf:'center', fontFamily: Fonts.MosseThai_Regular, lineHeight: 12}}>{item[i+1].date}</Text>
            </View>
          
            </View>
             : null }
  
            </View>
        )
      }
      return HistoryList

    }

  render() {
    return (
      <View style = {styles.container}>
      <CustomToolbarwithNav  title = {this.props.navigation.getParam('title', 'Sales')} 
      onBackpress = {() => {this.props.navigation.goBack()}} onBellpress = {() => {this.props.navigation.push('notification')}}/>
      <ScrollView
            scrollEventThrottle={16}
            onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }])}  >
            <View>
            <View style = {{padding: windowWidth*0.06, backgroundColor: '#f6f6f6'}}>
            <View style = {{flexDirection: 'row',justifyContent: 'space-around'}}>
            <View>
            <TextMask
              value= '6992'
              type={'money'}
              options={{ unit: '',precision: 3 }}
              style = {styles.textmoney}
            />
              <Text style = {styles.TextMask}>รูปที่ขาย</Text>
            </View>

            <View>
            <TextMask
              value= '174800'
              type={'money'}
              options={{ unit: '',precision: 3 }}
              style = {styles.textmoney}
            />
              <Text style = {styles.TextMask}>บาท</Text>
            </View>
            </View>
            </View>

            <View style = {{ marginHorizontal: windowWidth * 0.055}}>
              
              <View style = {{flexDirection: 'row', marginVertical:10,  justifyContent: 'space-between', alignItems:'baseline'}}>
              <Text style = {styles.TextMask}>ยอดที่สามารถถอนได้</Text>
              <Text style = {{fontFamily: Fonts.MosseThai_Medium, color: '#bc2121', fontSize: 12}}>ขั้นต่ำถอนเงิน 5,000 บาท</Text>
              </View>

              <View style = {{padding: 10, alignItems: 'flex-end', backgroundColor: '#f6f6f6'}}>
              <TextMask
              value= '174800'
              type={'money'}
              options={{ unit: '',precision: 3 }}
              style = {styles.textmoney}
            />
              </View>

              <TouchableOpacity style = {{alignSelf: 'center', width: windowWidth * 0.5, marginVertical: 15,
              height: windowWidth * 0.13, backgroundColor: '#f9a53e', justifyContent: 'center', borderRadius: windowWidth * 0.3}}>
              <Text style = {{fontFamily: Fonts.MosseThai_Medium, fontSize: 18, color: '#fff', alignSelf: 'center'}}>ถอนเงิน</Text>
              </TouchableOpacity>
              <Text style = {{fontFamily: Fonts.MosseThai_Medium, color: '#bc2121', alignSelf: 'center',fontSize: 12}}>ใช้เวลาดำเนินการไม่เกิน 7 วัน</Text>
          
            </View>
            <View>
            <View style = {{borderTopWidth: 1, borderColor: '#eae5e5', borderBottomWidth: 1}}>
            <Text style = {[styles.TextMask,{paddingHorizontal: windowWidth * 0.055, paddingVertical: 10, alignSelf: 'flex-start'}]}>ประวัติการถอนเงิน</Text>
            </View>
            </View>

            <View>
            { this.renderHistorySection(dataTips) }
            </View>

        </View>
        </ScrollView>  
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
    textmoney:{
      fontFamily: Fonts.MosseThai_Bold,
      fontSize: 30,
      color: '#5a5a5a'
    },
    TextMask:{
      fontFamily: Fonts.MosseThai_Bold,
      fontSize: 18,
      color: '#5a5a5a',
      textAlign: 'center'
    },
    smallimagesize:{
      height: windowWidth*1/3, width: windowWidth*1/3
    },
    buttontype:{ 
      backgroundColor: '#7bd834',
      justifyContent: 'center', 
      alignItems: 'center',
      width: 32, 
      height: 32, 
      borderRadius: 100
    }
})
