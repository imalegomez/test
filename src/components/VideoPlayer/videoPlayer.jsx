import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import ChannelHeader from '../ChannelHeader/channelHeader';
import styles from './styles';

const VideoPlayer = ({ selectedChannel, onExitVideo }) => {
  const videoRef = useRef(null);
  const [showHeader, setShowHeader] = useState(false);
  const lastInteractionRef = useRef(Date.now());

  useEffect(() => {
    const lockOrientation = async () => {
      if (Platform.OS !== 'web') {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    };
    lockOrientation();

    return () => {
      if (Platform.OS !== 'web') {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      }
    };
  }, []);

  useEffect(() => {
    const hideHeaderTimeout = setInterval(() => {
      if (Date.now() - lastInteractionRef.current > 3000) {
        setShowHeader(false);
      }
    }, 3000);

    return () => clearInterval(hideHeaderTimeout);
  }, []);

  const handleScreenTap = useCallback(() => {
    setShowHeader(true);
    lastInteractionRef.current = Date.now();
  }, []);

  const handleFullscreenUpdate = useCallback(({ fullscreenUpdate }) => {
    if (fullscreenUpdate === Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS) {
      onExitVideo();
    }
  }, [onExitVideo]);

  return (
    <Pressable onPress={handleScreenTap} style={styles.container}>
      {showHeader && (
        <ChannelHeader
          title={selectedChannel?.title || "Sin título"}
          onExit={onExitVideo}
        />
      )}
      <View style={styles.videoContainer}>
        {Platform.OS === 'web' ? (
          <video ref={videoRef} style={styles.video} controls autoPlay />
        ) : (
          <>
            <StatusBar hidden />
            <Video
              ref={videoRef}
              source={{ uri: selectedChannel.url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="stretch"
              shouldPlay
              style={styles.video}
              onFullscreenUpdate={handleFullscreenUpdate}
            />
          </>
        )}
      </View>
    </Pressable>
  );
};

export default React.memo(VideoPlayer);