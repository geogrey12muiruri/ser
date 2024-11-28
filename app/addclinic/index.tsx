import { StyleSheet, Text, View, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'; 
import React, { useState } from 'react';
import { useSelector } from 'react-redux'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ClinicInfo from './ClinicInfo';
import EducationInfo from './EducationInfo';
import Review from './Review';
import { selectUser } from '../store/userSlice'; 
import Colors from '@/components/Shared/Colors';
import { useRouter } from 'expo-router';
import { windowWidth, windowHeight } from '@/theme/app.constant'; // Import responsive functions

const Index = () => {
  const [step, setStep] = useState(1);
  const [clinicData, setClinicData] = useState({});
  const [educationData, setEducationData] = useState({});
  const navigation = useNavigation();
  const router = useRouter();

  const user = useSelector(selectUser); 
  const professionalId = user?.professional?._id; 

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleClinicDataChange = (data) => {
    console.log('Updated Clinic Data in Index:', data);
    setClinicData(data);
  };

  const handleEducationDataChange = (data) => {
    setEducationData(data);
  };

  const submit = async (payload) => {
    try {
      const { images, ...clinicDataWithoutImages } = payload.clinicData;
      console.log('Clinic Data before submission:', clinicDataWithoutImages);
      const response = await fetch(`https://medplus-health.onrender.com/api/clinics/register/${professionalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: clinicDataWithoutImages.name,
          contactInfo: clinicDataWithoutImages.contactInfo,
          address: clinicDataWithoutImages.address,
          insuranceCompanies: clinicDataWithoutImages.insuranceCompanies,
          specialties: clinicDataWithoutImages.specialties, // Ensure specialties is included
          education: payload.educationData,
          languages: clinicDataWithoutImages.languages,
          assistantName: clinicDataWithoutImages.assistantName,
          assistantPhone: clinicDataWithoutImages.assistantPhone,
          bio: clinicDataWithoutImages.bio,
          certificateUrl: payload.educationData.certificateUrl,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Clinic registered successfully:', data);
        router.push('/professional');
        setStep(1);
        setClinicData({});
        setEducationData({});
      } else {
        console.error('Error registering clinic:', data);
        Alert.alert('Error', 'Error registering clinic');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {step === 1 && (
          <ClinicInfo
            prevStep={prevStep}
            nextStep={nextStep}
            clinicData={clinicData}
            onClinicDataChange={handleClinicDataChange}
            professionalId={professionalId}
          />
        )}
        {step === 2 && (
          <EducationInfo
            prevStep={prevStep}
            nextStep={nextStep}
            educationData={educationData}
            onEducationDataChange={handleEducationDataChange}
          />
        )}
        {step === 3 && (
          <Review
            prevStep={prevStep}
            clinicData={clinicData}
            educationData={educationData}
            submit={submit}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ligh_gray,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth(16), // Use responsive width
  },
  button: {
    width: windowWidth(200), // Responsive button width
    height: windowHeight(50), // Responsive button height
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: windowWidth(10), // Responsive border radius
  },
  buttonText: {
    fontSize: windowWidth(16), // Responsive font size
    color: Colors.white,
  },
  input: {
    width: windowWidth(300), // Responsive input width
    height: windowHeight(40), // Responsive input height
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: windowWidth(5), // Responsive border radius
    paddingHorizontal: windowWidth(10), // Responsive padding
    marginVertical: windowHeight(10), // Responsive margin
  },
  title: {
    fontSize: windowWidth(24), // Responsive title font size
    fontWeight: 'bold',
    color: Colors.dark_gray,
    marginBottom: windowHeight(20), // Responsive margin
  },
});
