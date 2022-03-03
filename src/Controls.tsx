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
  customIconStyle?: CustomIconStyle;
};

const Controls = (props: ControlsProps) => {
  const {
    customIconStyle: CstmIconStyles = {},
    isLoading,
    playerState,
    onReplay,
    onPause,
  } = props;
  const icon = getPlayerStateIcon(playerState);
  const pressAction = playerState === PLAYER_STATES.ENDED ? onReplay : onPause;

  const content = isLoading ? (
    <ActivityIndicator size="large" color="#FFF" />
  ) : (
    <TouchableOpacity
      style={[styles.playButton, CstmIconStyles]}
      onPress={pressAction}
      accessibilityLabel={PLAYER_STATES.PAUSED ? 'Tap to Play' : 'Tap to Pause'}
      accessibilityHint={'Plays and Pauses the Video'}
    >
      <Image source={icon} style={styles.playIcon} />
    </TouchableOpacity>
  );

  return <View style={[styles.controlsRow]}>{content}</View>;
};

export { Controls };
