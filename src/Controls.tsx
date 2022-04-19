import React from 'react';
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  ViewStyle,
} from 'react-native';
import styles from './MediaControls.style';
import { getPlayerStateIcon } from './utils';
import type { Props } from './MediaControls';
import { PLAYER_STATES } from './constants/playerStates';

export type CustomIconStyle = {
  customIconStyle: ViewStyle;
};

type ControlsProps = Pick<Props, 'isLoading' | 'playerState' | 'onReplay'> & {
  onPause: () => void;
  onSkipFor: () => void;
  onSkipBack: () => void;
  customIconStyle?: CustomIconStyle;
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
  } = props;
  const icon = getPlayerStateIcon(playerState);
  const forwardIcon = require('./assets/ic_forward.png');
  const backwardIcon = require('./assets/ic_backward.png');

  const pressAction = playerState === PLAYER_STATES.ENDED ? onReplay : onPause;

  const content = isLoading ? (
    <ActivityIndicator size="large" color="#FFF" />
  ) : (
    <>
      {(Boolean(onSkipBack) || Boolean(onSkipFor)) && (
        <TouchableOpacity
          style={[styles.playButton, CstmIconStyles]}
          onPress={onSkipBack}
          accessibilityLabel={'skip back/ change track'}
          accessibilityHint={'skip back/ change track'}
        >
          <Image source={backwardIcon} style={styles.playIcon} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.playButton, CstmIconStyles]}
        onPress={pressAction}
        accessibilityLabel={
          PLAYER_STATES.PAUSED ? 'Tap to Play' : 'Tap to Pause'
        }
        accessibilityHint={'Plays and Pauses the Video'}
      >
        <Image source={icon} style={styles.playIcon} />
      </TouchableOpacity>
      {(Boolean(onSkipBack) || Boolean(onSkipFor)) && (
        <TouchableOpacity
          style={[styles.playButton, CstmIconStyles]}
          onPress={onSkipFor}
          accessibilityLabel={'skip forward/ change track'}
          accessibilityHint={'skip forward/ change track'}
        >
          <Image source={forwardIcon} style={styles.playIcon} />
        </TouchableOpacity>
      )}
    </>
  );

  return <View style={[styles.controlsRow]}>{content}</View>;
};

export { Controls };
