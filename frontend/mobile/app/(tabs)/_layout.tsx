import useTheme from '@/hooks/UseTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
const TabsLayout = () => {
  const {colors} = useTheme();

  return (
    <>
      <Tabs initialRouteName="index" screenOptions={{ 
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={colors.gradients.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.35)',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          borderRadius: 40,
          overflow: 'hidden',
        }
        }}>
        
        <Tabs.Screen 
        name='hotline'
        options={{
        title: "Hotline", 
        tabBarIcon: ({color,size}) => (
            <Ionicons name= "call-outline" size={size} color={color}/>  
        )
        }}
        />
        <Tabs.Screen 
        name='map'
        options={{
        title: "Map", 
        tabBarIcon: ({color,size}) => (
            <Ionicons name= "map" size={size} color={color}/>  
        )
        }}
        />
        <Tabs.Screen 
        name='index' 
        options={{
        title: "Home", 
        tabBarIcon: ({color,size}) => (
            <Ionicons name="home-outline" size={size} color={color}/>  
        )
        }}
        />
        
        <Tabs.Screen 
        name='reports' 
        options={{
        title: "Reports", 
        tabBarIcon: ({color,size}) => (
            <Ionicons name= "notifications-outline" size={size} color={color}/>  
        )
        }}
        />
        <Tabs.Screen 
        name='profile' 
        options={{
        title: "Profile", 
        tabBarIcon: ({color,size}) => (
            <Ionicons name= "person-outline" size={size} color={color}/>  
        )
        }}
        />
      </Tabs>
    </>
  )
}

export default TabsLayout