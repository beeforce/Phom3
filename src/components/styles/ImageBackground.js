import React, { Component } from 'react'
import { 
  StyleSheet, 
  View,
 } from 'react-native'
 import FastImage from 'react-native-fast-image'


class ImageBackground extends React.Component {
 

  render() {
    const {children, style, imageStyle, imageRef, ...props} = this.props;

    return (
      <View
        accessibilityIgnoresInvertColors={true}
        style={style}
        ref={this._captureRef}>
        <FastImage
          {...props}
          style={[
            StyleSheet.absoluteFill,
            {
              width: style.width,
              height: style.height,
            },
            imageStyle,
          ]}
          ref={imageRef}
        />
        {children}
      </View>
    );
  }
}

module.exports = ImageBackground;