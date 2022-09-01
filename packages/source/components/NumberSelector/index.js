import React, {PureComponent} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import LabelError from '../LabelError';

import {iconDark, textPrimary} from '../../../config/colors';
import styles from './styles';

export default class NumberSelector extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number.isRequired,
    step: PropTypes.number,
    value: PropTypes.number,
    placeholder: PropTypes.any,
    onNumberChanged: PropTypes.func,
    disabled: PropTypes.bool,
    directTextEdit: PropTypes.bool,
    error: PropTypes.bool,
    required : PropTypes.bool
  };

  static defaultProps = {
    label: '',
    max: null,
    step: 1,
    value: 0,
    onNumberChanged: () => {},
    placeholder: 0,
    disabled: false,
    directTextEdit: false,
    error: false,
    required : false
  };

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }

  onChangeText = value => {
    const {max, min, step, onNumberChanged} = this.props;
    const sanitizedValue = Number(value);
    if (isNaN(sanitizedValue)) {
      return;
    }
    if (step && sanitizedValue % step !== 0) {
      return;
    }
    if (min && sanitizedValue < min) {
      return;
    }
    if (max && sanitizedValue > max) {
      return;
    }
    this.setState(
      {
        value: sanitizedValue,
      },
      () => {
        onNumberChanged(sanitizedValue);
      },
    );
  };

  update = increment => {
    const {max, min, step, onNumberChanged} = this.props;
    const {value} = this.state;
    let finalValue;
    if (increment) {
      finalValue = step ? value + step : value + 1;
      if (max && finalValue > max) {
        finalValue = value;
      }
    } else {
      finalValue = step ? value - step : value - 1;
      if ((min || min === 0) && finalValue < min) {
        finalValue = value;
      }
    }
    this.setState(
      {
        value: finalValue,
      },
      () => {
        onNumberChanged(finalValue);
      },
    );
  };

  render() {
    const {label, value, error, placeholder, disabled, directTextEdit} =
      this.props;
    return (
      <View>
        <LabelError label={label} error={error} required = {this.props.required}/>

        <View style={styles.inputContainer}>
          <View style={styles.controllersContainer}>
            <TouchableOpacity
              style={styles.leftMargin10}
              disabled={disabled}
              onPress={() => {
                this.update(false);
              }}>
              <Icon name="remove" size={30} color={iconDark} />
            </TouchableOpacity>
          </View>

          <TextInput
            editable={directTextEdit}
            onChangeText={this.onChangeText}
            underlineColorAndroid="transparent"
            placeholder={`${placeholder}`}
            value={value ? `${value}` : ''}
            placeholderTextColor={textPrimary}
            style={styles.input}
          />

          <View style={styles.controllersContainer}>
            <TouchableOpacity
              style={styles.rightMargin10}
              disabled={disabled}
              onPress={() => {
                this.update(true);
              }}>
              <Icon name="add" size={30} color={iconDark} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
