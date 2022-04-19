# react-native-video-basic-controls

React native video controls.
Controls for the [react-native-video](https://github.com/react-native-video/react-native-video) component for Android and IOS.

## Features

- Full screen support.
- Volume and brightness control.
- Seek forword and back button.
- Slider customisation.

## Installation

```sh
npm install react-native-video-basic-controls
```

#### For Brightness or Volume controls install [react-native-system-setting](https://github.com/c19354837/react-native-system-setting)

```sh
npm install react-native-system-setting
```

link react-native-system-setting

```sh
react-native link
```

Add permission in android/app/src/main/AndroidManifest.xml

```js
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="YourPackageName"
    android:versionCode="1"
    android:versionName="1.0">

    <!-- setBrightness() & setScreenMode() & saveBrightness() -->
    <uses-permission android:name="android.permission.WRITE_SETTINGS" />

    ...

</manifest>
```

## Usage

```js
// Require the module
import MediaControls, {
  PLAYER_STATES,
} from 'react-native-video-basic-controls';

const App = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  return (
    <View style={styles.container}>
      <Video {...videoProps} />
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
        <MediaControls.Toolbar>// ...</MediaControls.Toolbar>
      </MediaControls>
    </View>
  );
};
```

Refer to [example](https://github.com/prathmesh28/react-native-video-basic-controls/tree/master/example) for implementation of this project

## Props

### Main Props

| Prop        | Type     | Optional | Default | Description                                                                                           |
| ----------- | -------- | -------- | ------- | ----------------------------------------------------------------------------------------------------- |
| progress    | number   | No       |         | Current time of the media player                                                                      |
| duration    | number   | No       |         | Total duration of the media                                                                           |
| playerState | number   | No       |         | Could be PLAYING, PAUSED or ENDED (take a look at constants section)                                  |
| onPaused    | function | No       |         | Triggered when the play/pause button is pressed. It returns the new toggled value (PLAYING or PAUSED) |
| onSeek      | function | No       |         | Triggered when the user released the slider                                                           |
| onReplay    | function | Yes      |         | Triggered when the replay button is pressed                                                           |
| onSeeking   | function | Yes      |         | Triggered when the user is interacting with the slider                                                |

### Other Props

| Prop            | Type      | Optional | Default | Description                                                                  |
| --------------- | --------- | -------- | ------- | ---------------------------------------------------------------------------- |
| isLoading       | boolean   | Yes      | false   | When is loading (displays loading icon)                                      |
| fadeOutDelay    | number    | Yes      | 5000    | Allows to customize the delay between fade in and fade out transition        |
| onFullScreen    | function  | Yes      |         | Custom fullscreen function, triggered when the fullscreen button is pressed. |
| showOnStart     | boolean   | Yes      | true    | controls the visibility of the controls during the initial render            |
| fullScreenIconL | component | Yes      |         | Fullscreen icon (landscape mode)                                             |
| fullScreenIconP | component | Yes      |         | Fullscreen icon (Portrait mode)                                              |
| bufferValue     | number    | Yes      |         | Add buffer value to Slider                                                   |
| onSkipFor       | String    | Yes      |         | To seek forward                                                              |
| onSkipBack      | String    | Yes      |         | To seek back                                                                 |
| showOnStart     | boolean   | Yes      | false   | show controls on start                                                       |
| showVolume      | boolean   | Yes      | false   | show Volume controls                                                         |
| showBrightness  | boolean   | Yes      | false   | show Brightness controls                                                     |
| sliderScale     | number    | Yes      | 10      | scale brightness/ volume slider on press                                     |

### Style Props

| Prop               | Type       | Optional | Default                | Description                                     |
| ------------------ | ---------- | -------- | ---------------------- | ----------------------------------------------- |
| mainColor          | string     | Yes      | rgba(12, 83, 175, 0.9) | Change custom color to the media controls       |
| containerStyle     | StyleSheet | Yes      |                        | Apply styles to the container                   |
| toolbarStyle       | StyleSheet | Yes      |                        | Apply styles to <MediaControls.Toolbar>         |
| iconStyle          | StyleSheet | Yes      |                        | Apply styles to fullscreen icon                 |
| sliderStyle        | StyleSheet | Yes      |                        | Apply styles to Slider                          |
| bufferColor        | String     | Yes      | #fff                   | Change color of buffer view                     |
| VSliderOuterStyles | StyleSheet | Yes      |                        | Apply styles to volume/brightness outer slider. |
| VSliderInnerStyles | StyleSheet | Yes      |                        | Apply styles to volume/brightness track slider. |

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
