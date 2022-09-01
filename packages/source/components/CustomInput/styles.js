import {Platform, StyleSheet} from 'react-native';

import {
  error as errorColor,
  textInputBorderColor,
  textPrimary,
} from '../../../config/colors';

export default (fontSize, error, icon, disabled, showBorder, multiline) =>
  StyleSheet.create({
    container: {
      // borderBottomWidth: showBorder ? 1 : 0,
      // borderBottomColor: textInputBorderColor,
      opacity: disabled ? 0.7 : 1
    },
    inputStyle: {
      height: multiline ? 100 : 50,
      borderWidth: 1,
      borderColor : '#D9DEE8',
      textAlignVertical: 'center',
      fontSize,
      color: error ? errorColor : textPrimary,
      marginTop: Platform.OS === 'ios' && multiline ? 15 : 5,
      padding : 10,
      borderRadius : 5
    },
    iconStyle: {
      position: 'absolute',
      right: 10,
      top: 30,
      bottom: 0,
      justifyContent: 'center',
    },
  });
