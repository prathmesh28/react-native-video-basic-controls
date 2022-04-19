import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import MediaControls, {
  PLAYER_STATES,
} from 'react-native-video-basic-controls';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    bufferValue: 0,
    isLoading: true,
    paused: true,
    playerState: PLAYER_STATES.PAUSED,
    fullscreen: false,
  };
  async componentDidMount() {
    this.setState({ loading: true });
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
      return <View />;
    } else
      return (
        <SafeAreaView on style={styles.container}>
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
              style={styles.videoStyle}
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
                this.state.bufferValue !== data.playableDuration
                  ? this.setState({ bufferValue: data.playableDuration })
                  : null;
                this.setState({ currentTime: data.currentTime });
              }}
              // controls={Platform.OS === 'android' ? false : true}
              controls={false}
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
            {/* {Platform.OS === 'android' && ( */}
            <MediaControls
              bufferValue={this.state.bufferValue}
              duration={this.state.duration}
              isLoading={this.state.isLoading}
              mainColor="#00DCCD"
              // bufferColor=""
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
                <Icon name="fullscreen" size={20} color="#00DCCD" />
              }
              fullScreenIconL={
                <Icon name="fullscreen-exit" size={20} color="#00DCCD" />
              }
              onPaused={(itm) => this.onPaused(itm)}
              onReplay={() => this.onReplay()}
              onSeek={(itm) => this.onSeek(itm)}
              onSeeking={(itm) => this.onSeeking(itm)}
              playerState={this.state.playerState}
              progress={this.state.currentTime}
              onSkipFor={() =>
                this.videoPlayer.seek(this.state.currentTime + 5, 30)
              }
              onSkipBack={() =>
                this.videoPlayer.seek(this.state.currentTime - 5, 30)
              }
              showVolume={true}
              showBrightness={true}
              // VSliderOuterStyles={{}}
              // VSliderInnerStyles={{}}
            >
              {/* <MediaControls.Toolbar></MediaControls.Toolbar> */}
            </MediaControls>
            {/* )} */}
          </View>
        </SafeAreaView>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  videoStyle: {
    width: '100%',
    height: '100%',
  },
});

export default App;
