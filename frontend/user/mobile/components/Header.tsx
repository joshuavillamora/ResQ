import { createHomeStyles } from '@/assets/styles/home.style'
import useTheme from '@/hooks/UseTheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Text, View } from 'react-native'

const Header = () => {
  const {colors} = useTheme();
  const homestyle = createHomeStyles(colors) 
  return (
    <LinearGradient colors={colors.gradients.header} style={homestyle.header}>
      <View style={homestyle.titleContainer}>
        <LinearGradient colors={colors.gradients.primary} style={homestyle.iconContainer}>
          <Ionicons name='heart-outline' size={24} color="pink"/>
        </LinearGradient>
        <View>
          <Text style={homestyle.title}>ResQ</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

export default Header