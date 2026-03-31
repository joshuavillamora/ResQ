import { createHomeStyles } from '@/assets/styles/home.style'
import useTheme from '@/hooks/UseTheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, Pressable, View } from 'react-native'

type HeaderProps = {
  menuOpen: boolean;
  onMenuToggle: () => void;
};

const Header = ({ menuOpen, onMenuToggle }: HeaderProps) => {
  const {colors} = useTheme();
  const homestyle = createHomeStyles(colors) 

  return (
    <LinearGradient colors={colors.gradients.header} style={homestyle.header}>
      <View style={homestyle.headerContent}>
        <View style={homestyle.logoContainer}>
          <Image
            source={require('@/assets/images/Header.png')}
            style={{ width: 140, height: 48 }}
            resizeMode='contain'
          />
        </View>

        <View style={homestyle.menuAnchor}>
          <Pressable style={homestyle.menuToggleButton} onPress={onMenuToggle}>
            <Ionicons name={menuOpen ? 'close' : 'menu'} size={28} color='white' />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  )
}

export default Header