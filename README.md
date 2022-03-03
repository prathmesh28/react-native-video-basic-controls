# react-native-video-basic-controls
React native video controls.
Controls for the [react-native-video](https://github.com/react-native-video/react-native-video) component with full screen support.

## Installation

```sh
npm install react-native-video-basic-controls
```

## Usage

```js

// Require the module
import MediaControls, { PLAYER_STATES } from 'react-native-video-basic-controls';

const App = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  return (
    <View style={styles.container}>
      <Video
        {...videoProps}
      />
      <MediaControls
        duration={duration}
        isLoading={isLoading}
        mainColor="orange"
        onFullScreen={noop}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        playerState={playerState}
        progress={currentTime}
      >
        <MediaControls.Toolbar>
          // ...
        </MediaControls.Toolbar>
      </MediaControls>
    </View>
  );
};



```

Refer to [example](https://github.com/prathmesh28/react-native-video-basic-controls/tree/master/example) for implementation of this project


## Props
| Prop         | Type     | Optional | Default                | Description                                                          |
|--------------|----------|----------|------------------------|----------------------------------------------------------------------|
| mainColor    | string   | Yes      | rgba(12, 83, 175, 0.9) | Change custom color to the media controls                            |
| isLoading    | boolean  | Yes      | false                  | When is loading (displays loading icon)                              |
| fadeOutDelay | number   | Yes      | 5000                   | Allows to customize the delay between fade in and fade out transition|
| progress     | number   | No       |                        | Current time of the media player                                     |
| duration     | number   | No       |                        | Total duration of the media                                          |
| playerState  | number   | No       |                        | Could be PLAYING, PAUSED or ENDED (take a look at constants section) |
| onFullScreen | function | Yes      |                        | Custom fullscreen function, triggered when the fullscreen button is pressed. (Optional)|
| onPaused     | function | No       |                        | Triggered when the play/pause button is pressed. It returns the new toggled value (PLAYING or PAUSED)                     |
| onReplay     | function | Yes      |                        | Triggered when the replay button is pressed                          |
| onSeek       | function | No       |                        | Triggered when the user released the slider                          |
| onSeeking    | function | Yes      |                        | Triggered when the user is interacting with the slider               |
| showOnStart  | boolean  | Yes      | true                   | controls the visibility of the controls during the initial render    |
| fullScreenIconL | component  | Yes      |                   | Fullscreen icon (landscape mode)                                     |
| fullScreenIconP | component  | Yes      |                   | Fullscreen icon (Portrait mode)                                      |
| containerStyle | StyleSheet | Yes  |                        | Apply styles to the container                                        |
| iconStyle    | StyleSheet | Yes    |                        | Apply styles to fullscreen icon                                      |
| sliderStyle | StyleSheet | Yes    |                        | Apply styles to Slider                                                |


```js
sliderStyle={{
  thumbStyle:{
     // ...
   },
   trackStyle:{
     // ...
   },
   containerStyle:{
     // ...
   }
}}
```

## Contributing

See the [contributing guide](https://github.com/prathmesh28/react-native-video-basic-controls/blob/master/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
