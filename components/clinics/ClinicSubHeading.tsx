import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../Shared/Colors';
import { useFonts, Poppins_600SemiBold, Poppins_300Light, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

interface ClinicSubHeadingProps {
  subHeadingTitle: string;
}

const ClinicSubHeading: React.FC<ClinicSubHeadingProps> = ({ subHeadingTitle }) => {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{subHeadingTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default ClinicSubHeading;