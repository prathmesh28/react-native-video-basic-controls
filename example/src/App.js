import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-video-basic-controls';
import Icon from 'react-native-vector-icons/MaterialIcons';
let windowWidth = Dimensions.get('window').width;
class App extends Component {
  state = {
    buffer: false,
    error: '',
    thumbnailUrl: '',
    videoUrl: '',
    loading: true,
    currentQuality: null,
    expanded: false,
    videoData: [],
    videoPlayer: null,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    paused: true,
    playerState: PLAYER_STATES.PAUSED,
    fullscreen: false,
  };
  async componentDidMount() {
    this.setState({ loading: true })
    const VIMEO_ID = '76979871';
    await fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then((res) => res.json())
      .then((res) => {
        let tempData = res.request.files.progressive;
        this.setState({
          thumbnailUrl: res.video.thumbs['640'],
          videoData: tempData,
          videoUrl: tempData[0].url,
          currentQuality: tempData[0].quality,
        });
      });
    this.setState({ loading: false });
  }

  onPaused = (playerState) => {
    this.setState({ paused: !this.state.paused, playerState });
  };
  onReplay = () => {
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer?.seek(0);
  };
  onSeek = (seek) => {
    this.videoPlayer?.seek(seek);
  };
  onSeeking = (currentTime) => this.setState({ currentTime });

  render() {
    if (this.state.loading) {
      return <View></View>;
    } else
      return (
        <View style={styles.container}>
          <View style={styles.videoStyle}>
            <Video
              id="video"
              ref={(ref) => {
                this.videoPlayer = ref;
              }}
              source={{
                uri: this.state.videoUrl,
                type: 'mp4',
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
              poster={this.state.thumbnailUrl}
              resizeMode={'contain'}
              repeat
              cache={true}
              onLoadStart={() => this.setState({ isLoading: true })}
              onLoad={(data) => {
                this.setState({
                  // currentQuality: data.naturalSize,
                  duration: data.duration,
                  isLoading: false,
                });
              }}
              onProgress={(data) => {
                this.setState({ currentTime: data.currentTime });
              }}
              controls={false}
              controls={Platform.OS === 'android' ? false : true}
              paused={this.state.paused}
              onEnd={() => {
                // this.setState({ playerState: PLAYER_STATES.ENDED })
              }}
              onBuffer={(e) => {
                e.isBuffering
                  ? this.setState({ isLoading: true })
                  : this.setState({ isLoading: false });
                this.state.buffer === e.isBuffering
                  ? null
                  : this.videoPlayer.seek(this.state.currentTime, 30);
                this.setState({ buffer: e.isBuffering });
              }}
              onError={(e) => {
                this.setState({ error: e });
              }}
            />
            {Platform.OS === 'android' && (
              <MediaControls
                duration={this.state.duration}
                isLoading={this.state.isLoading}
                mainColor="#00DCCD"
                sliderStyle={{
                  thumbStyle: {
                    width: 12,
                    height: 12,
                  },
                  trackStyle: {
                    height: 2,
                  },
                }}
                fullScreenIconP={
                  <Icon name="fullscreen" size={20} color="#fff" />
                }
                fullScreenIconL={
                  <Icon name="fullscreen-exit" size={20} color="#fff" />
                }
                onPaused={(itm) => this.onPaused(itm)}
                onReplay={() => this.onReplay()}
                onSeek={(itm) => this.onSeek(itm)}
                onSeeking={(itm) => this.onSeeking(itm)}
                playerState={this.state.playerState}
                progress={this.state.currentTime}
              >
                <MediaControls.Toolbar></MediaControls.Toolbar>
              </MediaControls>
            )}
          </View>
        </View>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  videoStyle: {
    height: windowWidth * 0.65,
    width: windowWidth,
  },
});

export default App;
