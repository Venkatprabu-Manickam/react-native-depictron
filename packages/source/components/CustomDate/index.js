import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import LabelError from '../LabelError';
import styles from './styles';
import {grey500} from '../../../config/colors';

export default class CustomDate extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onDateChange: PropTypes.func,
    disabled: PropTypes.bool,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    dateFormat: PropTypes.string,
    error: PropTypes.bool,
    required : PropTypes.bool
  };

  static defaultProps = {
    label: '',
    value: new Date(),
    placeholder: '',
    onDateChange: () => {},
    disabled: false,
    minDate: null,
    maxDate: null,
    dateFormat: 'DD-MM-YYYY',
    error: false,
    required : false
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedDate: new Date(),
    };
  }

  componentDidMount() {
    this.setState({
      selectedDate: this.formateDate(this.props.value, this.props.dateFormat),
    });
  }

  onDateChange = date => {
    const {onDateChange} = this.props;
    onDateChange(moment(date).format(this.props.dateFormat ?? 'DD-MM-YYYY'));
  };

  handleConfirm = selectedDate => {
    this.setState({selectedDate});
    this.onDateChange(selectedDate);
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.toggleDatePicker();
  };

  toggleDatePicker = () => {
    this.setState({showModal: !this.state.showModal});
  };

  formateDate = (date = new Date(), format = 'DD-MM-YYYY') =>
    moment(date, format).toDate();

  render() {
    const {label, disabled, minDate, maxDate, dateFormat, error} = this.props;
    const moreOptions = {};
    if (minDate) {
      moreOptions.minDate = minDate;
    }
    if (maxDate) {
      moreOptions.maxDate = maxDate;
    }
    return (
      <View>
        <LabelError label={label} error={error} required = {this.props.required}/>

        <TouchableOpacity
          style={styles.pickerInputContainer}
          onPress={this.toggleDatePicker}>
          <Text style={styles.dateText}>
            {moment(this.state.selectedDate).format(dateFormat)}
          </Text>

          <Icon name="calendar" size={20} color={grey500} />
        </TouchableOpacity>

        <DateTimePickerModal
          disabled={disabled}
          isVisible={this.state.showModal}
          value={this.state.selectedDate}
          date={this.state.selectedDate}
          mode="date"
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      </View>
    );
  }
}
