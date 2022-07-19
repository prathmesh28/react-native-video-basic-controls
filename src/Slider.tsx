import React from 'react';
import { TouchableOpacity, View, Text, Image, ViewStyle } from 'react-native';
import styles from './MediaControls.style';
import { humanizeVideoDuration } from './utils';
import type { Props as MediaControlsProps } from './MediaControls';
import { PLAYER_STATES } from './constants/playerStates';
import SliderOP from './SliderOP';
export type CustomSliderStyle = {
  containerStyle: ViewStyle;
  trackStyle: ViewStyle;
  thumbStyle: ViewStyle;
};

type Props = Pick<
  MediaControlsProps,
  | 'progress'
  | 'duration'
  | 'bufferValue'
  | 'mainColor'
  | 'bufferColor'
  | 'onFullScreen'
  | 'playerState'
  | 'onSeek'
  | 'fullScreenIconL'
  | 'fullScreenIconP'
> & {
  onSeeking?: (value: number) => void;
  onPause: () => void;
  customSliderStyle?: CustomSliderStyle;
  isFullscreen: Boolean;
};

const fullScreenImage = require('./assets/ic_fullscreen.png');

const Slider = (props: Props) => {
  const {
    fullScreenIconL,
    fullScreenIconP,
    customSliderStyle,
    duration,
    bufferValue,
    mainColor,
    bufferColor,
    onFullScreen,
    isFullscreen,
    onPause,
    progress,
  } = props;
  const fullScreenIcon = isFullscreen ? fullScreenIconL : fullScreenIconP;
  const containerStyle = customSliderStyle?.containerStyle || {};
  const customTrackStyle = customSliderStyle?.trackStyle || {};
  const customThumbStyle = customSliderStyle?.thumbStyle || {};

  const dragging = (value: number) => {
    const { onSeeking = () => {}, playerState } = props;
    onSeeking(value);

    if (playerState === PLAYER_STATES.PAUSED) {
      return;
    }

    onPause();
  };

  const seekVideo = (value: number) => {
    props.onSeek(value);
    onPause();
  };
  return (
    <View
      style={[styles.controlsRow, styles.progressContainer, containerStyle]}
    >
      <View style={styles.progressColumnContainer}>
        <View style={[styles.timerLabelsContainer]}>
          <Text style={styles.timerLabel}>
            {humanizeVideoDuration(progress)}
          </Text>
          <Text style={styles.timerLabel}>
            {humanizeVideoDuration(duration)}
          </Text>
        </View>
        <SliderOP
          style={[styles.progressSlider]}
          onValueChange={dragging}
          onSlidingComplete={seekVideo}
          maximumValue={Math.floor(duration)}
          value={Math.floor(progress)}
          trackStyle={[styles.track, customTrackStyle]}
          thumbStyle={[
            styles.thumb,
            customThumbStyle,
            { backgroundColor: mainColor },
          ]}
          minimumTrackTintColor={mainColor}
          bufferTrackTintColor={bufferColor}
          bufferValue={bufferValue}
        />
      </View>
      <TouchableOpacity
        style={styles.fullScreenContainer}
        onPress={onFullScreen}
      >
        {fullScreenIcon ? fullScreenIcon : <Image source={fullScreenImage} />}
      </TouchableOpacity>
    </View>
  );
};

export { Slider };
