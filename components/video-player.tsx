import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import * as ScreenOrientation from "expo-screen-orientation";

interface VideoPlayerProps {
  videoUrl: string;
  onUnmountSignal: boolean; // Tín hiệu từ component cha để thông báo khi unmount
}

const VideoPlayer = ({ videoUrl, onUnmountSignal }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { width, height } = Dimensions.get("window");
  const videoHeight = width * (9 / 16);

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
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

  // useEffect để lắng nghe tín hiệu từ cha khi component unmount
  useEffect(() => {
    if (onUnmountSignal) {
      // Giải phóng tài nguyên video khi nhận tín hiệu
      if (player) {
        player.pause()     
        player.release(); // Dừng video
        // Thực hiện các thao tác giải phóng tài nguyên nếu cần
      }
    }
  }, [onUnmountSignal, player]);

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
