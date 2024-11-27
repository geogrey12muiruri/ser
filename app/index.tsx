import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Redirect } from 'expo-router';

export default function Index() {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        setLoggedInUser(!!token);
      } catch (error) {
        console.error('Failed to fetch the token', error);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Redirect href={!loggedInUser ? '/(routes)/onboarding' : '/(tabs)'} />
      )}
    </>
  );
}