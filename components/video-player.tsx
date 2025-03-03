import React, { useState } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  const { width, height } = Dimensions.get("window");
  const videoHeight = width * (9 / 16); // Tỷ lệ 16:9

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    } else {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <View
      className={`justify-center items-center bg-black overflow-hidden ${
        isFullscreen ? "w-full h-full" : ""
      }`}
      style={!isFullscreen ? { height: videoHeight } : undefined}
    >
      {isLoading && (
        <ActivityIndicator size="large" color="#3B82F6" className="absolute" />
      )}
      <Video
        source={{ uri: videoUrl }}
        resizeMode={ResizeMode.CONTAIN}
        onLoad={() => setIsLoading(false)}
        onError={(error) => {
          console.error("Lỗi phát video:", error);
          setIsLoading(false);
        }}
        className="w-full"
        style={
          isFullscreen
            ? { width: height, height: width }
            : { width: width, height: videoHeight }
        }
        shouldPlay={shouldPlay}
        useNativeControls
      />
    </View>
  );
};

export default VideoPlayer;
