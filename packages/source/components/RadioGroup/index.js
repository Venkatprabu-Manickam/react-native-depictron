import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import _ from 'lodash';

import LabelError from '../LabelError';
import CustomInput from '../CustomInput';

import styles from './styles';
import colors from '../../../config/colors';

function CustomRadioButton(props) {
  const {
    labelHorizontal = true,
    index,
    value,
    isSelected,
    onCheck,
    innerCircleColor,
    outerCircleColor,
  } = props;
  return (
    <RadioButton
      labelHorizontal={labelHorizontal}
      key={index}
      style={styles.radioContainer}>
      <RadioButtonInput
        obj={value}
        index={index}
        isSelected={isSelected}
        onPress={onCheck}
        borderWidth={1}
        buttonInnerColor={innerCircleColor}
        buttonOuterColor={outerCircleColor}
        buttonSize={15}
        buttonOuterSize={20}
        buttonStyle={{}}
        buttonWrapStyle={styles.radioLableStyle}
      />

      <RadioButtonLabel
        obj={value}
        index={index}
        labelHorizontal={labelHorizontal}
        onPress={onCheck}
        labelStyle={styles.labelStyle}
        labelWrapStyle={{}}
      />
    </RadioButton>
  );
}

export default class RadioGroup extends Component {
  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.array.isRequired,
    onRadioValueChanged: PropTypes.func,
    other: PropTypes.bool,
    value: PropTypes.string,
    error: PropTypes.bool,
    required : PropTypes.bool
  };

  static defaultProps = {
    label: '',
    onRadioValueChanged: () => {},
    other: false,
    value: '',
    error: false,
    required : false
  };

  state = {
    selectedValue: '',
    textValue: '',
  };

  onCheck = value => {
    const {onRadioValueChanged} = this.props;
    const {selectedValue} = this.state;
    const newValue = value;
    if (newValue !== 'other') {
      this.setState({
        selectedValue: newValue,
        textValue: '',
      });
      onRadioValueChanged(newValue);
    } else {
      if (selectedValue !== 'other') {
        onRadioValueChanged('');
      }
      this.setState({
        selectedValue: newValue,
      });
    }
  };

  onOtherTextChanged = text => {
    const {onRadioValueChanged} = this.props;
    onRadioValueChanged(text);
  };

  renderOtherInput = () => {
    const {selectedValue, textValue} = this.state;
    if (selectedValue === 'other') {
      return (
        <CustomInput
          style={styles.otherInput}
          value={textValue}
          keyboardType="default"
          validation={v => v}
          onChangeText={this.onOtherTextChanged}
        />
      );
    }
    return null;
  };

  render() {
    const {
      label,
      options,
      error,
      other,
      innerCircleColor = colors.primary,
      outerCircleColor = colors.black,
    } = this.props;
    const {selectedValue} = this.state;
    const propValue = this.props.value;
    return (
      <View>
        <LabelError label={label} error={error} required = {this.props.required}/>

        <View style={styles.radioContainer}>
          {_.map(options, (value, i) => (
            <CustomRadioButton
              key={i}
              index={i}
              value={value}
              isSelected={propValue === value.value}
              onCheck={this.onCheck}
              innerCircleColor={innerCircleColor}
              outerCircleColor={outerCircleColor}
            />
          ))}

          {other ? (
            <View style={styles.otherRow}>
              <CustomRadioButton
                index="other"
                value={{label: 'Other', value: 'other'}}
                isSelected={selectedValue === 'other'}
                onCheck={this.onCheck}
                innerCircleColor={innerCircleColor}
                outerCircleColor={outerCircleColor}
                isOther
              />

              <View style={styles.container}>{this.renderOtherInput()}</View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
