import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './userSlice';
import appointmentsReducer from './appointmentsSlice';
import scheduleReducer from './scheduleSlice';
import doctorReducer from './doctorSlice';
import clinicsReducer from './clinicSlice';
import patientReducer from './patientSlice'; 


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'prescription', 'doctors', 'schedules', 'clinics'],
};

const rootReducer = combineReducers({
  user: userReducer,
  appointments: appointmentsReducer,
  schedules: scheduleReducer,
  doctors: doctorReducer,
  clinics: clinicsReducer,
  patient: patientReducer, 
 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }), // Remove .concat(thunk)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
