import {StyleSheet} from 'react-native';
import {primaryDark} from '../../../config/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  addButton: {
    color: primaryDark,
  },
  fileContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  remove: {
    color: 'red',
    fontSize: 14,
  },
  preview: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  file: {
    textDecorationLine: 'underline',
    color: primaryDark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledOpacity: {
    opacity : 0.5
  },
  uploadContainer:  {
    width : '100%',
    height : 130,
    borderColor : '#0068B3',
    borderWidth : 1,
    borderRadius  :4,
    alignItems : 'center',
    justifyContent : 'center',
    marginTop : 15,
    borderStyle : 'dashed'
  }
});
