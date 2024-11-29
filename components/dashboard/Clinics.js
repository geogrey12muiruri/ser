import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Button,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClinics,
  filterClinics,
  selectClinics,
  clearClinics,
  setSelectedClinic, // Import the setSelectedClinic action
  fetchClinicImages, // Import the new action
} from '../../app/store/clinicSlice';
import SubHeading from '../dashboard/SubHeading';
import Colors from '../Shared/Colors';
import * as SplashScreen from 'expo-splash-screen';

import { useRouter } from 'expo-router';
import axios from 'axios';
import {
  Poppins_600SemiBold,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import useFetchClinics from '../../hooks/useFetchClinics';

SplashScreen.preventAutoHideAsync();

const Clinics = ({ searchQuery, onViewAll }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { clinics, getClinicImages } = useFetchClinics();

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filteredClinicList = useSelector(selectClinics);
  const loading = useSelector(state => state.clinics.loading);
  const error = useSelector(state => state.clinics.error);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (filteredClinicList.length === 0) {
      dispatch(fetchClinics());
    }
  }, [dispatch, filteredClinicList.length]);

  useEffect(() => {
    if (searchQuery) {
      dispatch(filterClinics({ searchQuery }));
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (!loading && filteredClinicList.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, filteredClinicList]);

  const handlePress = item => {
    const professionalImages = item.professionals.flatMap(professional => professional.clinic_images || []);
    const allImages = [...new Set([...item.images, ...professionalImages.map(image => image.urls[0])])];
    
    console.log('Navigating to clinic with images:', allImages); // Add this line to log the images being passed

    dispatch(setSelectedClinic({ ...item, images: allImages })); // Set the selected clinic in the Redux state

    router.push({
      pathname: `/hospital/book-appointment/${item._id}`,
    });
  };

  // const handleResetClinics = () => {
  //   dispatch(clearClinics());
  // };

  const ClinicItem = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(null);
    const imageFadeAnim = useRef(new Animated.Value(1)).current;
    const clinicImages = useSelector(state => (state.clinics.clinicImages || {})[item._id] || []);

    useEffect(() => {
      const fetchImages = async () => {
        try {
          if (clinicImages.length === 0) {
            const images = await getClinicImages(item);
            setCurrentImage(images[0]);
          } else {
            setCurrentImage(clinicImages[0]);
          }

          if (clinicImages.length > 1) {
            let imageIndex = 0;
            const interval = setInterval(() => {
              imageIndex = (imageIndex + 1) % clinicImages.length;

              Animated.timing(imageFadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                setCurrentImage(clinicImages[imageIndex]);
                Animated.timing(imageFadeAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              });
            }, 10000);

            return () => clearInterval(interval);
          }
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };

      fetchImages();
    }, [clinicImages, getClinicImages, item, imageFadeAnim]);

    return (
      <TouchableOpacity style={styles.clinicItem} onPress={() => handlePress(item)}>
        {currentImage ? (
          <Animated.Image
            source={{ uri: currentImage }}
            style={[styles.clinicImage, { opacity: imageFadeAnim }]}
          />
        ) : (
          <Animated.Image
            source={{ uri: 'https://via.placeholder.com/200x100?text=No+Image' }}
            style={styles.clinicImage}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.clinicName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.clinicCategory} numberOfLines={1}>{item.category}</Text>
          <Text style={styles.clinicAddress} numberOfLines={1}>{item.address}</Text>
          
          
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.GRAY} />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <Animated.View style={{ marginTop: 10, opacity: fadeAnim }}>
      <SubHeading subHeadingTitle={'Discover Clinics Near You'} onViewAll={onViewAll} />
      {/* <Button title="Reset Clinics" onPress={handleResetClinics} /> */}
      <FlatList
        data={filteredClinicList}
        horizontal={true}
        renderItem={({ item }) => <ClinicItem item={item} />}
        keyExtractor={item => item._id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  clinicItem: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 10,
    padding: 10,
    width: 200,
  },
  clinicImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 5,
  },
  clinicName: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  clinicAddress: {
    color: Colors.primary,
    fontFamily: 'Poppins_400Regular',
  },
  clinicCategory: {
    color: Colors.primary,
    marginTop: 5,
    fontFamily: 'Poppins_500Medium',
  },
  clinicContact: {
    color: Colors.primary,
    marginTop: 5,
  },
  clinicSpecialties: {
    color: Colors.primary,
    marginTop: 5,
  },
  clinicLanguages: {
    color: Colors.primary,
    marginTop: 5,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Clinics;
