import React, { useEffect, useState, useRef } from 'react';
import { View, Text, AppState, Platform } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const BACKGROUND_TASK = 'MODO_SENSE_BACKGROUND';
const SCORE_THRESHOLD = 0.65;
const COOLDOWN_MINUTES = 20;
let lastNudgeTime = 0;

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  console.log('Background check running');
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [stressScore, setStressScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const devices = useCameraDevices();
  const device = devices.front;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    (async () => {
      const cameraPerm = await Camera.requestCameraPermission();
      const notifPerm = await Notifications.requestPermissionsAsync();
      setHasPermission(cameraPerm === 'granted');
      
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
        minimumInterval: 15 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    })();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        setIsActive(false);
      }
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setIsActive(true);
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const sendNudge = async () => {
    const now = Date.now();
    if (now - lastNudgeTime < COOLDOWN_MINUTES * 60 * 1000) return;
    lastNudgeTime = now;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Modo Sense",
        body: "Detectamos tensión. Tomate 30 segundos para respirar 😮‍💨",
      },
      trigger: null,
    });
  };

  const processFrame = (frame: any) => {
    'worklet';
    // Acá iría MediaPipe Face Landmarker
    // Por ahora simulamos un score aleatorio para probar
    const fakeScore = Math.random();
    if (fakeScore > SCORE_THRESHOLD) {
      // runOnJS(sendNudge)();
    }
  };

  if (!hasPermission) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Pidiendo permisos de cámara...</Text></View>;
  if (!device) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Cargando cámara...</Text></View>;

  return (
    <View style={{flex:1}}>
      <Camera
        style={{flex:1}}
        device={device}
        isActive={isActive}
        frameProcessor={processFrame}
      />
      <View style={{position:'absolute',bottom:40,alignSelf:'center',backgroundColor:'black',padding:10,borderRadius:8}}>
        <Text style={{color:'white',fontSize:16}}>Modo Sense activo</Text>
        <Text style={{color:'white',fontSize:12}}>Stress: {stressScore.toFixed(2)}</Text>
      </View>
    </View>
  );
}
