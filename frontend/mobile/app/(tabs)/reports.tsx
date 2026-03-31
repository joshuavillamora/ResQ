import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

const reports = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/bg.png')}
      style={{ flex: 1 }}
      resizeMode='cover'
    >
      <View>
        <Text>reports</Text>
      </View>
    </ImageBackground>
  )
}

export default reports