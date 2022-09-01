import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

function Button({label, onPress, buttonStyle, buttonTextStyle, disabled}) {
  const buttonOpacity = {opacity: disabled ? 0.5 : 1};
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, buttonStyle, buttonOpacity]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.buttonLabel, buttonTextStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  buttonStyle: PropTypes.any,
  buttonTextStyle: PropTypes.any,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  onPress: () => {},
  buttonStyle: {},
  buttonTextStyle: {},
  disabled: false,
};

export default Button;
