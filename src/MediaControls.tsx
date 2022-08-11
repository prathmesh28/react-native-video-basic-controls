import React, { useState, useEffect } from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  ViewStyle,
  StatusBar,
  LogBox,
} from 'react-native';
import styles from './MediaControls.style';
import { PLAYER_STATES } from './constants/playerStates';
import { Controls, CustomIconStyle } from './Controls';
import { Slider, CustomSliderStyle } from './Slider';
import { Toolbar } from './Toolbar';
import Orientation, {
  useOrientationChange,
  useLockListener,
} from 'react-native-orientation-locker';
import SystemSetting from 'react-native-system-setting';
import VerticalSlider from './VerticalSlider';

export type Props = {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  duration: number;
  bufferValue: number;
  fadeOutDelay?: number;
  isLoading: boolean;
  mainColor?: string;
  bufferColor?: string;
  onFullScreen?: (event: GestureResponderEvent) => void;
  fullScreenIconP?: React.ReactNode;
  fullScreenIconL?: React.ReactNode;
  onPaused: (playerState: PLAYER_STATES) => void;
  onReplay?: () => void;
  onSeek: (value: number) => void;
  onSeeking?: (value: number) => void;
  onSkipFor?: () => void;
  onSkipBack?: () => void;
  playerState: PLAYER_STATES;
  progress: number;
  showOnStart?: boolean;
  sliderStyle?: CustomSliderStyle;
  iconStyle?: CustomIconStyle;
  toolbarStyle?: ViewStyle;
  VSliderOuterStyles?: ViewStyle;
  VSliderInnerStyles?: ViewStyle;
  showVolume?: boolean;
  showBrightness?: boolean;
  sliderScale?: number;
  sliderType?: 'Slider' | 'Swipe';
};

const MediaControls = (props: Props) => {
  const {
    children,
    containerStyle: customContainerStyle = {},
    duration,
    bufferValue = 0,
    fadeOutDelay = 5000,
    isLoading = false,
    mainColor = 'rgba(12, 83, 175, 0.9)',
    bufferColor = '#fff',
    onFullScreen,
    fullScreenIconP,
    fullScreenIconL,
    // onReplay=()=>{},
    onReplay: onReplayCallback = () => {},
    onSkipFor = () => {},
    onSkipBack = () => {},
    onSeek,
    onSeeking,
    playerState,
    progress,
    showOnStart = true,
    sliderStyle, // defaults are applied in Slider.tsx
    iconStyle,
    toolbarStyle: customToolbarStyle = {},
    VSliderOuterStyles,
    VSliderInnerStyles,
    showVolume = false,
    showBrightness = false,
    sliderScale = 10,
    sliderType = 'Slider',
  } = props;
  const { initialOpacity, initialIsVisible } = (() => {
    if (showOnStart) {
      return {
        initialOpacity: 1,
        initialIsVisible: true,
      };
    }

    return {
      initialOpacity: 0,
      initialIsVisible: false,
    };
  })();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [opacity] = useState(new Animated.Value(initialOpacity));
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const [isLocked, setLocked] = useState(false);
  const [volume, setVolume] = useState(0);
  const [brightness, setBrightness] = useState(0);

  useOrientationChange((o: string) => {
    if (o === 'PORTRAIT') {
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }
  });

  useLockListener((o: string) => {
    if (o === 'PORTRAIT') {
      setIsFullscreen(false);
    } else {
      setIsFullscreen(true);
    }
  });

  function checkLocked() {
    const locked = Orientation.isLocked();
    if (locked !== isLocked) {
      setLocked(locked);
    }
  }

  useEffect(() => {
    LogBox.ignoreAllLogs();
    if (SystemSetting.getVolume !== undefined) {
      SystemSetting.getVolume().then((vol) => {
        setVolume(vol);
      });
    }
    if (SystemSetting.getBrightness !== undefined) {
      SystemSetting.getBrightness().then((bright) => {
        setBrightness(bright);
      });
    }
    Orientation.getOrientation((o) => {
      if (o === 'PORTRAIT') {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    });
    checkLocked();
    fadeOutControls(fadeOutDelay);
    const volumeListener = SystemSetting.addVolumeListener((data) => {
      setVolume(data.value);
    });
    return () => SystemSetting.removeVolumeListener(volumeListener);
  }, []);

  const onVolumeChange = (value: number) => {
    SystemSetting.setVolume(value);
    volume !== value ? setVolume(value) : null;
  };
  const onBrightnessChange = (value: number) => {
    SystemSetting.setAppBrightness(value);
    volume !== value ? setBrightness(value) : null;
  };

  const fadeOutControls = (delay = 0) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 30,
      delay,
      useNativeDriver: false,
    }).start((result) => {
      /* I noticed that the callback is called twice, when it is invoked and when it completely finished
      This prevents some flickering */
      if (result.finished) {
        setIsVisible(false);
      }
    });
  };

  const fadeInControls = () => {
    setIsVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: 0,
      useNativeDriver: false,
    }).start();
  };

  const onReplay = () => {
    fadeOutControls(fadeOutDelay);
    onReplayCallback();
  };
  const onFullScreenFunction = () => {
    if (isFullscreen) {
      Orientation.lockToPortrait();
      checkLocked();
      setIsFullscreen(false);
    } else {
      Orientation.lockToLandscape();
      checkLocked();
      setIsFullscreen(true);
    }
  };
  const cancelAnimation = () => opacity.stopAnimation(() => setIsVisible(true));

  const onPause = () => {
    const { onPaused } = props;
    const { PLAYING, PAUSED, ENDED } = PLAYER_STATES;
    switch (playerState) {
      case PLAYING: {
        cancelAnimation();
        break;
      }
      case PAUSED: {
        fadeOutControls(fadeOutDelay);
        break;
      }
      case ENDED:
        break;
    }

    const newPlayerState = playerState === PLAYING ? PAUSED : PLAYING;
    return onPaused(newPlayerState);
  };

  const toggleControls = () => {
    // value is the last value of the animation when stop animation was called.
    // As this is an opacity effect, I used the value (0 or 1) as a boolean
    opacity.stopAnimation((value: number) => {
      setIsVisible(!!value);
      return value ? fadeOutControls() : fadeInControls();
    });
  };

  return (
    <TouchableWithoutFeedback accessible={false} onPress={toggleControls}>
      <Animated.View
        style={[styles.container, customContainerStyle, { opacity }]}
      >
        {isFullscreen && <StatusBar hidden />}
        {isVisible && (
          <View style={[styles.container, customContainerStyle]}>
            <View
              style={[
                styles.controlsRow,
                styles.toolbarRow,
                customToolbarStyle,
              ]}
            >
              {children}
            </View>
            <Controls
              brightness={brightness}
              volume={volume}
              showBrightness={showBrightness}
              showVolume={showVolume}
              onBrightness={onBrightnessChange}
              onVolume={onVolumeChange}
              showSlider={isFullscreen && sliderType === 'Swipe'}
              onPause={onPause}
              onReplay={onReplay}
              onSkipFor={onSkipFor}
              onSkipBack={onSkipBack}
              isLoading={isLoading}
              playerState={playerState}
              customIconStyle={iconStyle}
            />
            <Slider
              progress={progress}
              duration={duration}
              bufferValue={bufferValue}
              mainColor={mainColor}
              bufferColor={bufferColor}
              onFullScreen={onFullScreen ? onFullScreen : onFullScreenFunction}
              isFullscreen={isFullscreen}
              fullScreenIconL={fullScreenIconL}
              fullScreenIconP={fullScreenIconP}
              playerState={playerState}
              onSeek={onSeek}
              onSeeking={onSeeking}
              onPause={onPause}
              customSliderStyle={sliderStyle}
            />
            {isFullscreen && sliderType === 'Slider' && (
              <>
                {showBrightness && (
                  <View style={styles.VSliderLeft}>
                    <VerticalSlider
                      value={brightness}
                      disabled={false}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={onBrightnessChange}
                      onComplete={onBrightnessChange}
                      width={4}
                      height={200}
                      borderRadius={50}
                      SliderMaxStyles={VSliderOuterStyles}
                      SliderMinStyles={VSliderInnerStyles}
                      ballColor={mainColor}
                      sliderScale={sliderScale}
                    />
                  </View>
                )}
                {showVolume && (
                  <View style={styles.VSliderRight}>
                    <VerticalSlider
                      value={volume}
                      disabled={false}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={onVolumeChange}
                      onComplete={onVolumeChange}
                      width={4}
                      height={200}
                      borderRadius={50}
                      SliderMaxStyles={VSliderOuterStyles}
                      SliderMinStyles={VSliderInnerStyles}
                      ballColor={mainColor}
                      sliderScale={sliderScale}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

MediaControls.Toolbar = Toolbar;

export default MediaControls;
