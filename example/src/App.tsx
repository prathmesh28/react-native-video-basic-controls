import React from 'react';
import { SafeAreaView, StyleSheet, View, Dimensions } from 'react-native';
import Video from 'react-native-video';
import MediaControls, {
  PLAYER_STATES,
} from 'react-native-video-basic-controls';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';
const { height, width } = Dimensions.get('window');
interface props {}

interface state {
  buffer: boolean;
  error: string;
  thumbnailUrl: string;
  videoUrl: string;
  loading: boolean;
  currentQuality: string;
  expanded: boolean;
  currentTime: number;
  duration: number;
  bufferValue: number;
  isLoading: boolean;
  paused: boolean;
  playerState: number;
  fullscreen: boolean;
}
class App extends React.Component<props, state> {
  private videoPlayer: React.RefObject<Video>;
  constructor(props: props) {
    super(props);
    this.videoPlayer = React.createRef();
    this.state = {
      buffer: false,
      error: '',
      thumbnailUrl: '',
      videoUrl: '',
      loading: true,
      currentQuality: '',
      expanded: false,
      currentTime: 0,
      duration: 0,
      bufferValue: 0,
      isLoading: true,
      paused: true,
      playerState: PLAYER_STATES.PAUSED,
      fullscreen: false,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const VIMEO_ID = '76979871';
    await fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then((res) => res.json())
      .then((res) => {
        let tempData = res.request.files.progressive;
        this.setState({
          thumbnailUrl: res.video.thumbs['640'],
          videoUrl: tempData[0].url,
          currentQuality: tempData[0].quality,
        });
      });
    this.setState({ loading: false });
  }

  onPaused = (playerState: number) => {
    this.setState({ paused: !this.state.paused, playerState });
  };
  onReplay = () => {
    this.setState({ playerState: PLAYER_STATES.PLAYING });
    this.videoPlayer?.current?.seek(0);
  };
  onSeek = (seek: number) => {
    this.videoPlayer?.current?.seek(seek);
  };
  onSeeking = (currentTime: number) => this.setState({ currentTime });

  render() {
    if (this.state.loading) {
      return <View />;
    } else
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.videoStyle}>
            <Video
              ref={this.videoPlayer}
              source={{
                uri: this.state.videoUrl,
                type: 'mp4',
              }}
              style={styles.videoSty}
              poster={this.state.thumbnailUrl}
              resizeMode={'contain'}
              repeat
              onLoadStart={() => this.setState({ isLoading: true })}
              onLoad={(data) => {
                this.setState({
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
              controls={Platform.OS === 'ios' ? true : false}
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
                  : this.videoPlayer.current?.seek(this.state.currentTime, 30);
                this.setState({ buffer: e.isBuffering });
              }}
              onError={(e) => {
                // console.log(e);
                // this.setState({ error: e })
              }}
            />
            {Platform.OS === 'android' ? (
              <MediaControls
                bufferValue={this.state.bufferValue}
                duration={this.state.duration}
                isLoading={this.state.isLoading}
                mainColor="red"
                // bufferColor=""
                sliderStyle={{
                  thumbStyle: {
                    width: 12,
                    height: 12,
                  },
                  trackStyle: {
                    height: 2,
                  },
                  containerStyle: {},
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
                // onSkipFor={() =>
                //   this.videoPlayer.current?.seek(this.state.currentTime + 5, 30)
                // }
                // onSkipBack={() =>
                //   this.videoPlayer.current?.seek(this.state.currentTime - 5, 30)
                // }
                showVolume={true}
                showBrightness={true}
                sliderType="Slider"
                // VSliderOuterStyles={{marginHorizontal:40}}
                // VSliderInnerStyles={{}}
                // onFullScreen={Platform.OS==="ios"?()=>{}:null}

                // sliderScale
              >
                {/* <MediaControls.Toolbar></MediaControls.Toolbar> */}
              </MediaControls>
            ) : null}
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
    height: height > width ? width : height,
  },
  videoSty: {
    width: '100%',
    height: '100%',
  },
});

export default App;
