import React from 'react'
import { ImageBackground, Text, View } from 'react-native'
import Header from '@/components/Header'
import useDrawer from '@/hooks/UseDrawer'
import useTheme from '@/hooks/UseTheme'
import { createHomeStyles } from '@/assets/styles/home.style'

const Profile = () => {
  const { menuOpen, toggleMenu } = useDrawer()
  const { colors } = useTheme()
  const homestyle = createHomeStyles(colors)

  return (
    <ImageBackground
      source={require('@/assets/images/bg.png')}
      style={{ flex: 1 }}
      resizeMode='cover'
    >
      <View style={homestyle.safeArea}>
        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        <View style={{ height: 90 }} />
        <View>
          <Text>profile</Text>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Profile  