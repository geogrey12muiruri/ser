import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function Index() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Redirect href={!user ? '/(routes)/onboarding' : '/(tabs)'} />
      )}
    </>
  );
}