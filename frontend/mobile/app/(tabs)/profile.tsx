import React from 'react'
import { ImageBackground, Text, View } from 'react-native'

const profile = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/bg.png')}
      style={{ flex: 1 }}
      resizeMode='cover'
    >
      <View>
        <Text>profile</Text>
      </View>
    </ImageBackground>
  )
}

export default profile  