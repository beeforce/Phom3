import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Fonts } from '../../utill/Fonts';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import IcoMoonConfig from '../../selection.json';
const Icon = createIconSetFromIcoMoon(IcoMoonConfig);

export default class CustomToolbar extends Component {
  render() {
    return (
      <View style = {{backgroundColor: '#fff'}}>
    <LinearGradient colors={['#fad961', '#f76b1c']}>
    <SafeAreaView>
    <View style = {{height: 56, justifyContent: 'flex-end'}}>
    <Text style = {styles.toolbarTitle}>{this.props.title}</Text>
      <TouchableOpacity 
      onPress={this.props.onBackpress}
      style = {styles.toolbarBellimage}>
      <Icon
          name="bell"
          size={16}
          color= '#f76b1c'
        />
      </TouchableOpacity>
      </View>
      </SafeAreaView>
    </LinearGradient>

    </View>
    )
  }
}

const styles = StyleSheet.create({
  toolbarTitle:{
    fontSize: 18,
    fontFamily: Fonts.MosseThai_Bold,
    color: '#fff',
    position: 'absolute',
    bottom: 0, 
    left: 0,
    paddingLeft: 20,
    paddingBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2
  },
  toolbarBellimage: {
    height:35, 
    width: 35, 
    borderRadius: 18, 
    backgroundColor:'#fff', 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    marginRight: 15, 
    marginBottom: 10, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
})
