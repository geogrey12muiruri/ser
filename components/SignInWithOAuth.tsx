import React, { useEffect } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import JWT from 'expo-jwt';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const SignInWithOAuth: React.FC<{ setErrorMessage: (message: string | null) => void; router: any; }> = ({ setErrorMessage, router }) => {
  const configureGoogleSignIn = () => {
    if (Platform.OS === 'android') {
      GoogleSignin.configure({
        webClientId: '399287117531-tmvmbo06a5l8svihhb7c7smqt7iobbs0.apps.googleusercontent.com',
      });
    }
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await authHandler({
        name: userInfo.user.name!,
        email: userInfo.user.email!,
        avatar: userInfo.user.photo!,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const authHandler = async ({
    name,
    email,
    avatar,
  }: {
    name: string;
    email: string;
    avatar: string;
  }) => {
    const user = {
      name,
      email,
      avatar,
    };
    const token = JWT.encode(
      {
        ...user,
      },
      process.env.EXPO_PUBLIC_JWT_SECRET_KEY!
    );
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_SERVER_URI}/login`,
      {
        signedToken: token,
      }
    );
    await SecureStore.setItemAsync('accessToken', res.data.accessToken);
    router.push('/(tabs)');
  };

  return (
    <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
      <Image
        source={require('../assets/images/icons/google.png')}
        style={styles.googleIcon}
      />
      <Text style={styles.googleButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignInWithOAuth;
