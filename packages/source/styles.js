import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  row: {
    marginVertical: 10,
  },
  actionButtonContainer:  {
    flexDirection : 'row',
    justifyContent : 'flex-end'
  },
  buttonStyle : {
    backgroundColor: '#0077cb',
    height: 40,
    minWidth : 100,
    borderRadius: 5,
    marginRight : 5,
    marginTop : 20
  },
  buttonTextStyle : {
    fontSize: 15
  }
});
