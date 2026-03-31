import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

const Hotline = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/bg.png')}
      style={{ flex: 1 }}
      resizeMode='cover'
    >
      <View>
        <Text>hotline</Text>
      </View>
    </ImageBackground>
  )
}

export default Hotline