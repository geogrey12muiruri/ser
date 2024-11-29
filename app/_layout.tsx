import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../context/theme.context";
import {
  Poppins_600SemiBold,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import { AuthProvider } from '../context/AuthContext';
import { fontSizes } from '../theme/app.constant';
import { Provider as PaperProvider } from 'react-native-paper';

export default function _layout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins_600SemiBold,
    Poppins_300Light,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <PaperProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(routes)/onboarding/index" />
              <Stack.Screen name="register" options={{ title: 'Register', headerShown: true }} />
              <Stack.Screen name="client/tabs" options={{ headerShown: false }} />
              <Stack.Screen name="clinics/index" options={{ title: 'Clinics', headerShown: true }} />
              <Stack.Screen name="clinics/[name]" options={{ title: '', headerShown: false }} />
              <Stack.Screen name="hospital/book-appointment/[id]" options={{ title: '', headerShown: false }} />
              <Stack.Screen name="hospital/index" options={{ title: '', headerShown: false }} />
              <Stack.Screen name="hospital/[id]" options={{ title: '', headerShown: false }} />
              <Stack.Screen name="student/index" options={{ title: 'Student', headerShown: true }} />
              <Stack.Screen name="doctor/index" options={{ title: 'Doctor', headerShown: false }} />
              <Stack.Screen name="doctor/[doctorId]" options={{ title: 'Doctor Booking', headerShown: true }} />
              <Stack.Screen name="alldoctors/index" options={{ title: 'All Doctors', headerShown: true }} />
              <Stack.Screen name="[missing]" options={{ title: '404', headerShown: true }} />
              <Stack.Screen name="pharmacist/dashboard" options={{ title: 'Pharmacist Dashboard' }} />
              <Stack.Screen name="pharmacist/tabs" options={{ headerShown: false }} />
              <Stack.Screen name="appointment/[appointmentId]" options={{ title: 'Appointment Details' }} />
              <Stack.Screen name="PrescriptionScreen" options={{ title: 'Prescription' }} />
              <Stack.Screen name="addclinic/index" options={{ title: 'AddClinic' }} />
              <Stack.Screen name="tasks" options={{ title: 'Tasks', headerShown: true }} />
              <Stack.Screen name="consultations/index" options={{ title: 'Patients', headerShown: true }} />
              <Stack.Screen name="addpharmacy/index" options={{ title: 'Add Pharmacy' }} />
            </Stack>
          </PaperProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}