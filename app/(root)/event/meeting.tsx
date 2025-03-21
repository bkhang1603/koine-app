// import React, { useEffect, useState } from "react";
// import { View, Text, ActivityIndicator, Alert } from "react-native";
// import WebView from "react-native-webview";
// import { Camera } from "expo-camera";
// import { Audio } from "expo-av";
// import { useLocalSearchParams } from "expo-router";

// export default function MeetingScreen() {
//   const { id } = useLocalSearchParams(); // Lấy room ID từ URL
//   const [permissionsGranted, setPermissionsGranted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const roomUrl = id.toString();
//   console.log("id nè, ", id);

//   useEffect(() => {
//     const requestPermissions = async () => {
//       const { status: cameraStatus } =
//         await Camera.requestCameraPermissionsAsync();
//       const { status: audioStatus } = await Audio.requestPermissionsAsync();

//       if (cameraStatus === "granted" && audioStatus === "granted") {
//         setPermissionsGranted(true);
//       } else {
//         Alert.alert("Cần cấp quyền Camera & Microphone để tham gia cuộc họp.");
//       }
//       setLoading(false);
//     };

//     requestPermissions();
//   }, []);

//   return (
//     <View className="flex-1 bg-white">
//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color="#007AFF"
//           className="flex-1 justify-center items-center"
//         />
//       ) : permissionsGranted ? (
//         <WebView
//           source={{ uri: roomUrl }}
//           style={{ flex: 1 }}
//           allowsFullscreenVideo
//           javaScriptEnabled
//           domStorageEnabled
//           allowFileAccess
//           allowUniversalAccessFromFileURLs
//           allowsInlineMediaPlayback={true}
//           mediaCapturePermissionGrantType="grant"

//           onError={(syntheticEvent) => {
//             console.error("Lỗi WebView:", syntheticEvent.nativeEvent);
//             Alert.alert(
//               "Lỗi",
//               "Không thể tải trang họp, vui lòng thử lại sau."
//             );
//           }}
//           onMessage={(event) => {
//             const message = JSON.parse(event.nativeEvent.data);
//             console.log("WebView message:", message);

//             if (message.type === "microphone_toggle") {
//               console.log("Trạng thái micro:", message.payload.enabled);
//               if (!message.payload.enabled) {
//                 Alert.alert("Micro chưa bật, hãy kiểm tra trong cuộc họp.");
//               }
//             }
//           }}
//         />
//       ) : (
//         <View className="flex-1 justify-center items-center">
//           <Text className="text-[18px] text-red">
//             Cần cấp quyền Camera & Microphone
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }


import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";

export default function MeetingScreen() {
  const { id } = useLocalSearchParams(); // Lấy room ID từ URL
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const roomUrl = id.toString();
  console.log("room ", roomUrl)

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();

      if (cameraStatus === "granted" && audioStatus === "granted") {
        setPermissionsGranted(true);
      } else {
        Alert.alert("Cần cấp quyền Camera & Microphone để tham gia cuộc họp.");
      }
      setLoading(false);
    };

    requestPermissions();
  }, []);

  const openMeet = async () => {
    await WebBrowser.openBrowserAsync(roomUrl);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <Button title="Tham gia cuộc họp" onPress={openMeet} />
      )}
    </View>
  );
}

