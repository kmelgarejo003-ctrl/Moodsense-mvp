# Moodsense-mvp
{
  "name": "modosense-mvp",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": { "start": "expo start" },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-camera": "~15.0.0",
    "expo-notifications": "~0.28.0",
    "expo-task-manager": "~11.7.0",
    "expo-background-fetch": "~12.0.0",
    "react-native-vision-camera": "4.0.1",
    "react-native-worklets-core": "0.2.0",
    "@mediapipe/tasks-vision": "0.10.14",
    "react": "18.2.0",
    "react-native": "0.74.5"
  }
}{
  "expo": {
    "name": "Modo Sense",
    "slug": "modosense-mvp",
    "version": "1.0.0",
    "android": {
      "package": "app.modosense.mvp",
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO",
        "FOREGROUND_SERVICE",
        "FOREGROUND_SERVICE_CAMERA",
        "FOREGROUND_SERVICE_MICROPHONE",
        "WAKE_LOCK",
        "POST_NOTIFICATIONS"
      ]
    },
    "plugins": [
      ["react-native-vision-camera", { "cameraPermissionText": "Modo Sense usa la cámara para detectar tensión facial" }],
      ["expo-notifications"]
    ]
  }
}{
  "build": {
    "production": {
      "android": { "buildType": "apk" }
    }
  }
