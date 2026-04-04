import useTheme from '@/hooks/UseTheme';
import useDrawer, { DrawerProvider } from '@/hooks/UseDrawer';
import Menu from '@/components/Menu';
import ReportSent from "@/components/ReportSent";
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, View } from 'react-native';

const AnimatedTabs = () => {
  const { colors } = useTheme();
  const { menuOpen, closeMenu, overlayVisible, setOverlayVisible, selectedDisaster } = useDrawer();
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const animateMenu = useCallback((open: boolean) => {
    Animated.spring(menuAnimation, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      speed: 16,
      bounciness: 4,
    }).start();
  }, [menuAnimation]);

  useEffect(() => {
    animateMenu(menuOpen);
  }, [animateMenu, menuOpen]);

  const menuPanelStyle = {
    opacity: menuAnimation,
    transform: [
      {
        translateX: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-40, 0],
        }),
      },
    ],
  };

  const pageShellStyle = {
    transform: [
      {
        translateX: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screenWidth * 0.6],
        }),
      },
      {
        translateY: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screenHeight * 0.1],
        }),
      },
      {
        scale: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.75],
        }),
      },
    ],
    borderRadius: menuAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 18],
    }),
    overflow: 'hidden' as const,
  };

  const sideIconContainerStyle = {
    width: 40,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const sideIconStyle = (focused: boolean) => ({
    width: 35,
    height: 35,
    opacity: focused ? 1 : 0.7,
    tintColor: focused ? '#FF8800' : '#FFFFFF',
  });

  return (
    <LinearGradient colors={menuOpen ? ['#2e0a0a', '#2e0a0a'] : colors.gradients.background} style={{ flex: 1 }}>
      <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '58%',
              paddingTop: 90,
              paddingHorizontal: 14,
              backgroundColor: '#2e0a0a',
              zIndex: 30,
            },
            menuPanelStyle,
          ]}
          pointerEvents={menuOpen ? 'auto' : 'none'}
        >
          <Menu onItemPress={closeMenu} />
        </Animated.View>

        <Animated.View style={[{ flex: 1, zIndex: 10 }, pageShellStyle]}>
          <Tabs
            initialRouteName="index"
            screenOptions={{
              tabBarActiveTintColor: '#FF8800',
              tabBarInactiveTintColor: colors.textMuted,
              headerShown: false,
              tabBarShowLabel: false,
              tabBarBackground: () => (
                <LinearGradient
                  colors={['rgba(249, 2, 2, 0.05)', 'rgba(249, 2, 2, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              ),
              tabBarStyle: {
                position: 'absolute',
                bottom: 20,
                backgroundColor: 'transparent',
                borderWidth: 3,
                borderColor: 'rgba(255,255,255,0.35)',
                height: 75,
                paddingBottom: 10,
                paddingTop: 15,
                borderRadius: 20,
                overflow: 'hidden',
              },
              tabBarItemStyle: {
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          >
            <Tabs.Screen
              name='hotline'
              options={{
                title: 'Hotline',
                tabBarIcon: ({ focused }) => (
                  <View style={sideIconContainerStyle}>
                    <Image
                      source={require('@/assets/images/hotline.png')}
                      style={sideIconStyle(focused)}
                      resizeMode='contain'
                    />
                  </View>
                ),
              }}
            />
            <Tabs.Screen
              name='map'
              options={{
                title: 'Map',
                tabBarIcon: ({ focused }) => (
                  <View style={sideIconContainerStyle}>
                    <Image
                      source={require('@/assets/images/map.png')}
                      style={sideIconStyle(focused)}
                      resizeMode='contain'
                    />
                  </View>
                ),
              }}
            />
            <Tabs.Screen
              name='index'
              options={{
                title: 'Home',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={require('@/assets/images/Home btn.png')}
                    style={{ width: 50, height: 80, opacity: focused ? 1 : 0.7, tintColor: focused ? '#FF8800' : '#FFFFFF' }}
                    resizeMode='contain'
                  />
                ),
              }}
            />
            <Tabs.Screen
              name='reports'
              options={{
                title: 'Reports',
                tabBarIcon: ({ focused }) => (
                  <View style={sideIconContainerStyle}>
                    <Image
                      source={require('@/assets/images/reports.png')}
                      style={sideIconStyle(focused)}
                      resizeMode='contain'
                    />
                  </View>
                ),
              }}
            />
            <Tabs.Screen
              name='profile'
              options={{
                title: 'Profile',
                tabBarIcon: ({ focused }) => (
                  <View style={sideIconContainerStyle}>
                    <Image
                      source={require('@/assets/images/profile.png')}
                      style={sideIconStyle(focused)}
                      resizeMode='contain'
                    />
                  </View>
                ),
              }}
            />
            <Tabs.Screen
              name="reportUpdate"
              options={{
                title: 'Report Update',
                href: null,
                headerShown: false,
              }}
            />
          </Tabs>

          {menuOpen && (
            <Pressable
              style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'transparent', zIndex: 20 }}
              onPress={closeMenu}
            />
          )}
        </Animated.View>
        {overlayVisible && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100, // 👈 higher than menu
            }}
          >
            <ReportSent
              visible={overlayVisible}
              disaster={selectedDisaster}
              onClose={() => setOverlayVisible(false)}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};


const TabsLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<number | null>(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <DrawerProvider value={{ 
      menuOpen, 
      toggleMenu, 
      closeMenu,
      overlayVisible,
      setOverlayVisible,
      selectedDisaster,
      setSelectedDisaster
    }}>
      <AnimatedTabs />
    </DrawerProvider>
  )
}

export default TabsLayout