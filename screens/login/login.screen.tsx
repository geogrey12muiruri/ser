import React, { useState, useContext, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import GlobalApi from '../../Services/GlobalApi';
import { useDispatch } from 'react-redux';
import { login } from '../../app/store/userSlice';
import { AuthContext } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { fontSizes, windowHeight, windowWidth } from '@/theme/app.constant';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const passwordInputRef = createRef<TextInput>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { login: authLogin } = useContext(AuthContext);

  const handleLoginPress = async () => {
    if (email === '' || password === '') {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await GlobalApi.loginUser(email, password);
    
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      setErrorMessage(null);

      const {
        token,
        userId,
        firstName,
        lastName,
        email: userEmail,
        userType,
        doctorId,
        professional,
        profileImage,
        riderId,
      } = response.data;

      if (!firstName || !lastName) {
        console.error('First name or last name is missing:', { firstName, lastName });
      }

      dispatch(login({
        name: `${firstName} ${lastName}`,
        email: userEmail,
        userId,
        userType,
        professional,
        profileImage,
        riderId,
      }));

      authLogin({
        name: `${firstName} ${lastName}`,
        email: userEmail,
        userId,
        userType,
        professional,
        profileImage,
        riderId,
      });

      let route = '';
      switch (userType) {
        case 'professional':
          if (professional.profession === 'doctor') {
            route = professional.attachedToClinic ? '/professional' : '/addclinic';
          } else if (professional.profession === 'pharmacist' && !professional.attachedToPharmacy) {
            route = '/addpharmacy';
          } else if (professional.profession === 'pharmacist') {
            route = '/pharmacist/tabs';
          } else {
            route = '/professional';
          }
          break;
        case 'client':
          route = '/client/tabs';
          break;
        case 'student':
          route = '/student/tabs';
          break;
        case 'rider':
          route = '/rider/tabs';
          break;
        default:
          route = '/student/tabs';
      }

      router.push(route);
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: 'https://example.com/background-image.jpg' }}
                style={styles.logo}
              />
            </View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <View style={styles.SectionStyle}>
              <Icon name="mail-outline" size={20} color="#8b9cb5" style={styles.icon} />
              <TextInput
                style={styles.inputStyle}
                onChangeText={setEmail}
                placeholder="Enter Email"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <Icon name="lock-closed-outline" size={20} color="#8b9cb5" style={styles.icon} />
              <TextInput
                style={styles.inputStyle}
                onChangeText={setPassword}
                placeholder="Enter Password"
                placeholderTextColor="#8b9cb5"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={!showPassword}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
                <Icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#8b9cb5"
                />
              </TouchableOpacity>
            </View>
            {errorMessage && (
              <Text style={styles.errorTextStyle}>
                {errorMessage}
              </Text>
            )}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleLoginPress}
              disabled={isLoggingIn}>
              {isLoggingIn ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonTextStyle}>LOGIN</Text>
              )}
            </TouchableOpacity>
            <Text
              style={styles.registerTextStyle}
              onPress={() => router.push('/register')}>
              New Here? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    alignContent: 'center',
  },
  logo: {
    width: '50%',
    height: windowHeight(100),
    resizeMode: 'contain',
    margin: windowHeight(30),
  },
  welcomeText: {
    fontSize: fontSizes.FONT24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: windowHeight(20),
  },
  SectionStyle: {
    flexDirection: 'row',
    height: windowHeight(50),
    marginTop: windowHeight(20),
    marginLeft: windowWidth(35),
    marginRight: windowWidth(35),
    margin: windowHeight(10),
    borderWidth: 1,
    borderColor: '#dadae8',
    borderRadius: windowWidth(30),
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: windowWidth(15),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonStyle: {
    backgroundColor: '#226b80',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#226b80',
    height: windowHeight(50),
    alignItems: 'center',
    borderRadius: windowWidth(30),
    marginLeft: windowWidth(35),
    marginRight: windowWidth(35),
    marginTop: windowHeight(20),
    marginBottom: windowHeight(25),
    justifyContent: 'center',
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    fontSize: fontSizes.FONT16,
  },
  inputStyle: {
    flex: 1,
    color: '#333',
  },
  registerTextStyle: {
    color: '#226b80',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: fontSizes.FONT14,
    alignSelf: 'center',
    padding: windowHeight(10),
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: fontSizes.FONT14,
  },
  icon: {
    marginRight: windowWidth(10),
  },
  iconContainer: {
    padding: windowWidth(5),
  },
});
