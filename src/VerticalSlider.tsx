import * as React from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Easing,
  PanResponderInstance,
  GestureResponderEvent,
  PanResponderGestureState,
  ViewStyle,
  View,
} from 'react-native';

interface props {
  value?: number;
  disabled?: boolean;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onComplete?: (value: number) => void;
  width: number;
  height: number;
  SliderMaxStyles?: ViewStyle;
  SliderMinStyles?: ViewStyle;
  borderRadius?: number;
  step?: number;
  animationDuration?: number;
  sliderScale: number;
  ballColor: string;
}

interface state {
  sliderWidth: Animated.Value;
  sliderFullHeight: Animated.Value;
  value: number;
  sliderHeight: Animated.Value;
  panResponder: PanResponderInstance;
}

export default class VerticalSlider extends React.Component<props, state> {
  _moveStartValue: number = 0;

  constructor(props: props) {
    super(props);

    let panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // onMoveShouldSetPanResponderCapture: (_event: GestureResponderEvent,
      //   gestureState: PanResponderGestureState)=>{
      //     console.log(gestureState)
      //   },
      onPanResponderStart: () => {
        Animated.spring(this.state.sliderWidth, {
          toValue: this.props.width + this.props.sliderScale,
          useNativeDriver: false,
        }).start();
        Animated.spring(this.state.sliderFullHeight, {
          toValue: this.props.height + this.props.sliderScale / 2,
          useNativeDriver: false,
        }).start();
      },
      onPanResponderGrant: () => {
        this._moveStartValue = this.state.value;
      },
      onPanResponderMove: (
        _event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (this.props.disabled) {
          return;
        }
        // console.log(_event, gestureState);
        const value = this._fetchNewValueFromGesture(gestureState);
        this._changeState(value);
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      },
      onPanResponderRelease: (
        _event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (this.props.disabled) {
          return;
        }

        Animated.spring(this.state.sliderWidth, {
          toValue: this.props.width,
          useNativeDriver: false,
        }).start();
        Animated.spring(this.state.sliderFullHeight, {
          toValue: this.props.height,
          useNativeDriver: false,
        }).start();

        const value = this._fetchNewValueFromGesture(gestureState);
        this._changeState(value);
        if (this.props.onComplete) {
          this.props.onComplete(value);
        }
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: (
        _event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        if (this.props.disabled) {
          return;
        }
        const value = this._fetchNewValueFromGesture(gestureState);
        this._changeState(value);
        if (this.props.onComplete) {
          this.props.onComplete(value);
        }
      },
      // onMoveShouldSetPanResponderCapture
    });

    this.state = {
      sliderWidth: new Animated.Value(props.width),
      sliderFullHeight: new Animated.Value(props.height),
      value: props.value || props.min,
      sliderHeight: new Animated.Value(0),
      panResponder,
    };
  }

  _fetchNewValueFromGesture = (gestureState: any): number => {
    const { min, max, step, height } = this.props;
    const ratio = -gestureState.dy / height;
    const diff = max - min;
    if (step) {
      return Math.max(
        min,
        Math.min(
          max,
          this._moveStartValue + Math.round((ratio * diff) / step) * step
        )
      );
    }
    let value = Math.max(min, this._moveStartValue + ratio * diff);
    return Math.floor(value * 100) / 100;
  };

  _getSliderHeight = (value: number): number => {
    const { min, max, height } = this.props;
    return ((value - min) * height) / (max - min);
  };

  _changeState = (value: number): void => {
    const { animationDuration } = this.props;
    const sliderHeight = this._getSliderHeight(value);

    Animated.parallel([
      Animated.timing(this.state.sliderHeight, {
        toValue: sliderHeight,
        easing: Easing.linear,
        duration: animationDuration || 0,
        useNativeDriver: false,
      }),
    ]).start();
    this.setState({ value });
  };

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this._changeState(value);
    }
  }

  shouldComponentUpdate(nextProps: props, nextState: state) {
    if (nextProps.value && nextProps.value !== nextState.value) {
      this._changeState(nextProps.value);
    }
    return false;
  }

  render() {
    const {
      SliderMaxStyles,
      SliderMinStyles,
      height = 300,
      borderRadius = 5,
      sliderScale = 10,
      ballColor,
    } = this.props;

    const x = new Animated.Value(sliderScale);
    const ballSize = Animated.add(this.state.sliderWidth, x);
    const y = Animated.divide(ballSize, new Animated.Value(2));
    const ballBottom = Animated.subtract(this.state.sliderHeight, y);
    return (
      <View style={[{ marginHorizontal: sliderScale }, SliderMaxStyles]}>
        <Animated.View
          style={[
            styles.container,
            {
              width: this.state.sliderWidth,
              height,
              borderRadius,
            },
            // SliderMaxStyles,
          ]}
          {...this.state.panResponder.panHandlers}
        >
          <Animated.View
            style={[
              styles.slider,
              {
                height: this.state.sliderHeight,
                width: this.state.sliderWidth,
                backgroundColor: ballColor,
              },
              SliderMinStyles,
            ]}
          />
        </Animated.View>
        <Animated.View
          renderToHardwareTextureAndroid
          style={[
            styles.sliderBall,
            {
              backgroundColor: ballColor,
              width: ballSize,
              height: ballSize,

              bottom: ballBottom,
              left: -(sliderScale / 2),
            },
            // SliderMaxStyles
          ]}
          {...this.state.panResponder.panHandlers}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'grey',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
  },
  sliderBall: {
    position: 'absolute',
    borderRadius: 50,
  },
});
