import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform, View, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VideoPlayer from '../VideoPlayer/videoPlayer';
import ChannelList from '../ChannelList/channelList';
import MainHeader from '../MainHeader/mainHeader';
import BottomNav from '../BottomNav/bottomNav';
import VideoPlayerMainScreen from '../VideoPlayerMainScreen/videoPlayerMainScreen';
import { fetchChannels } from '../ChannelList/fetchChannels';

export function Main() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState({});
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();

  const loadChannels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const channelData = await fetchChannels();
      setChannels(channelData);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError('Failed to load channels.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const filteredChannels = useMemo(() => {
    if (!searchText) return channels;
    return Object.entries(channels).reduce((acc, [category, categoryChannels]) => {
      const filtered = categoryChannels.filter(channel =>
        channel.title.toLowerCase().includes(searchText.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    }, {});
  }, [channels, searchText]);

  const handleSelectChannel = useCallback((channel) => {
    setSelectedChannel(channel);
  }, []);

  const handleExitVideo = useCallback(() => {
    setSelectedChannel(null);
  }, []);

  const handleSearch = useCallback((text) => {
    setSearchText(text);
  }, []);

  const renderContent = useCallback(() => {
    if (loading) {
      return <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />;
    }

    if (error) {
      return <Text style={{ color: 'white' }}>{error}</Text>;
    }

    if (Platform.OS === 'web') {
      return (
        <>
          <MainHeader onSearch={handleSearch} />
          <VideoPlayerMainScreen selectedChannel={selectedChannel || { url: '', title: 'Default Video' }} />
          <ChannelList channels={filteredChannels} onSelectChannel={handleSelectChannel} />
        </>
      );
    }

    return selectedChannel ? (
      <VideoPlayer selectedChannel={selectedChannel} onExitVideo={handleExitVideo} />
    ) : (
      <>
        <MainHeader onSearch={handleSearch} /> 
        <StatusBar style='light' />
        <ChannelList channels={filteredChannels} onSelectChannel={handleSelectChannel} /> 
        <BottomNav />
      </>
    );
  }, [loading, error, selectedChannel, filteredChannels, handleSearch, handleExitVideo, handleSelectChannel]);

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
      {renderContent()}
    </View>
  );
}