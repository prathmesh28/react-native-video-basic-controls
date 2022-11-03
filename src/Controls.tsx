import React, { useState } from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  ViewStyle,
  TouchableHighlight,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Dimensions,
  Text,
} from 'react-native';
import styles from './MediaControls.style';
import { getPlayerStateIcon } from './utils';
import type { Props } from './MediaControls';
import { PLAYER_STATES } from './constants/playerStates';
const { height } = Dimensions.get('window');
export type CustomIconStyle = {
  customIconStyle: ViewStyle;
};

type ControlsProps = Pick<Props, 'isLoading' | 'playerState' | 'onReplay'> & {
  onPause: () => void;
  onSkipFor: () => void;
  onSkipBack: () => void;
  onBrightness: (value: number) => void;
  onVolume: (value: number) => void;
  customIconStyle?: CustomIconStyle;
  volume: number;
  brightness: number;
  showSlider: boolean;
  showBrightness: boolean;
  showVolume: boolean;
  isChild: boolean;
};

const Controls = (props: ControlsProps) => {
  const {
    customIconStyle: CstmIconStyles = {},
    isLoading,
    playerState,
    onReplay,
    onPause,
    onSkipFor,
    onSkipBack,
    onBrightness,
    onVolume,
    brightness,
    volume,
    showBrightness,
    showVolume,
    showSlider,
    isChild = false,
  } = props;
  const icon = getPlayerStateIcon(playerState);
  const forwardIcon = require('./assets/ic_forward.png');
  const backwardIcon = require('./assets/ic_backward.png');

  const [brightnessSwiper, showBrightnessSwiper] = useState(false);
  const [volumeSwiper, showVolumeSwiper] = useState(false);

  const pressAction = playerState === PLAYER_STATES.ENDED ? onReplay : onPause;

  const _panResponderBright = PanResponder.create({
    onPanResponderStart: () => {
      showBrightnessSwiper(true);
    },
    onPanResponderEnd: () => {
      showBrightnessSwiper(false);
    },
    onStartShouldSetPanResponder: () => showBrightness,
    onPanResponderMove: (
      _event: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => {
      onBrightness(getDirectionAndColor(gestureState, brightness));
    },
    onPanResponderTerminationRequest: () => showBrightness,
  });
  const _panResponderVol = PanResponder.create({
    onPanResponderStart: () => {
      showVolumeSwiper(true);
    },
    onPanResponderEnd: () => {
      showVolumeSwiper(false);
    },
    onStartShouldSetPanResponder: () => showVolume,
    onPanResponderMove: (
      _event: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ) => {
      onVolume(getDirectionAndColor(gestureState, volume));
    },
    onPanResponderTerminationRequest: () => showVolume,
  });

  const getDirectionAndColor = (
    gestureState: any,
    controlVolume: number
  ): number => {
    let min = 0;
    let max = 1;
    let step = 0.05;
    let _moveStartValue = controlVolume; //value
    const ratio = -gestureState.dy / height;
    const diff = max - min;
    let value = Math.max(
      min,
      Math.min(max, _moveStartValue + Math.round((ratio * diff) / step) * step)
    );
    let newVal = Math.floor(value * 100) / 100;

    return newVal;
  };
  const content = isLoading ? (
    <ActivityIndicator size="large" color="#FFF" />
  ) : (
    <>
      <View
        style={{
          ...styles.swipeSlider,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: brightnessSwiper
            ? 'rgba(0,0,0,' + brightness + ')'
            : 'transparent',
        }}
        {...(showSlider ? _panResponderBright.panHandlers : null)}
      >
        {brightnessSwiper && (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            {(brightness * 100).toFixed(1)}%
          </Text>
        )}
      </View>
      <View style={styles.playerButt}>
        {(Boolean(onSkipBack.name) || Boolean(onSkipFor.name)) && (
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={'#ffffff4d'}
            style={[styles.playButton, CstmIconStyles]}
            onPress={onSkipBack}
            accessibilityLabel={'skip back/ change track'}
            accessibilityHint={'skip back/ change track'}
          >
            <Image source={backwardIcon} style={styles.playIcon} />
          </TouchableHighlight>
        )}
      </View>
      <View style={styles.playerButt}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor={'#ffffff4d'}
          style={[styles.playButton, CstmIconStyles]}
          onPress={pressAction}
          accessibilityLabel={
            PLAYER_STATES.PAUSED ? 'Tap to Play' : 'Tap to Pause'
          }
          accessibilityHint={'Plays and Pauses the Video'}
        >
          <Image source={icon} style={styles.playIcon} />
        </TouchableHighlight>
      </View>
      <View style={styles.playerButt}>
        {(Boolean(onSkipBack.name) || Boolean(onSkipFor.name)) && (
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={'#ffffff4d'}
            style={[styles.playButton, CstmIconStyles]}
            onPress={onSkipFor}
            accessibilityLabel={'skip forward/ change track'}
            accessibilityHint={'skip forward/ change track'}
          >
            <Image source={forwardIcon} style={styles.playIcon} />
          </TouchableHighlight>
        )}
      </View>
      <View
        style={{
          ...styles.swipeSlider,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: volumeSwiper
            ? 'rgba(0,0,0,' + volume + ')'
            : 'transparent',
        }}
        {...(showSlider ? _panResponderVol.panHandlers : null)}
      >
        {volumeSwiper && (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            {(volume * 100).toFixed(1)}%
          </Text>
        )}
      </View>
    </>
  );

  return (
    <View style={{ ...styles.controlsRow, flex: isChild ? 1 : 2 }}>
      {content}
    </View>
  );
};

export { Controls };
