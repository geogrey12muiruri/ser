import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setClinics, selectClinics, setLoading, setError, setClinicImages } from '../app/store/clinicSlice';

const fetchFreshClinics = async () => {
  try {
    const response = await axios.get('https://medplus-health.onrender.com/api/clinics');
    const clinics = response.data.map((clinic) => ({
      ...clinic,
      images: clinic.images || [],
      professionals: clinic.professionals.map((professional) => ({
        ...professional,
        clinic_images: professional.clinic_images || [],
      })),
    }));
    await AsyncStorage.setItem('clinicList', JSON.stringify(clinics));
    return clinics; // Ensure clinics are returned
  } catch (error) {
    console.error('Failed to fetch fresh clinics', error);
    throw error;
  }
};

const fetchClinicImages = async (clinic) => {
  try {
    const professionalImages = await Promise.all(
      clinic.professionals.map(async (professional) => {
        const response = await axios.get(`https://medplus-health.onrender.com/api/images/professional/${professional._id}`);
        return response.data.map((image) => image.urls[0]);
      })
    );

    const allImages = new Set(clinic.images || []);
    professionalImages.flat().forEach(url => allImages.add(url));
    return Array.from(allImages);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

const useFetchClinics = () => {
  const dispatch = useDispatch();
  const clinics = useSelector(selectClinics);
  const clinicImages = useSelector(state => state.clinics.clinicImages);

  useEffect(() => {
    const fetchClinics = async () => {
      dispatch(setLoading(true));
      try {
        const cachedClinics = await AsyncStorage.getItem('clinicList');
        if (cachedClinics) {
          const parsedClinics = JSON.parse(cachedClinics);
          dispatch(setClinics(parsedClinics));
          fetchFreshClinics(); // Fetch fresh clinics in the background
        } else {
          const clinics = await fetchFreshClinics();
          dispatch(setClinics(clinics));
        }
      } catch (error) {
        dispatch(setError('Failed to load clinics'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (clinics.length === 0) {
      fetchClinics();
    }
  }, [dispatch, clinics.length]);

  const getClinicImages = useCallback(async (clinic) => {
    if (clinicImages[clinic._id]) {
      return clinicImages[clinic._id];
    }
    const images = await fetchClinicImages(clinic);
    dispatch(setClinicImages({ clinicId: clinic._id, images }));
    return images;
  }, [clinicImages, dispatch]);

  return { clinics, getClinicImages };
};

export default useFetchClinics;