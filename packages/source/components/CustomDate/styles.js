import {StyleSheet} from 'react-native';
import {grey500} from '../../../config/colors';

export default StyleSheet.create({
  dateContainer: {
    flex: 1,
    marginTop: 10,
  },
  pickerInputContainer: {
    height: 45,
    borderColor: grey500,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 5,
  },
});
