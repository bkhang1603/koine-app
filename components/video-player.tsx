import React, { useState } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import * as ScreenOrientation from "expo-screen-orientation";

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { width, height } = Dimensions.get("window");
  const videoHeight = width * (9 / 16);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
  });

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
      <VideoView
        player={player}
        style={
          isFullscreen
            ? { width: height, height: width }
            : { width: width, height: videoHeight }
        }
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
      />
    </View>
  );
};

export default VideoPlayer;
