import React, {PureComponent} from 'react';
import {Image, Switch, Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LabelError from '../LabelError';
import CustomInput from '../CustomInput';
import styles from './styles';
import images from '../../../assert';

function Checkbox(props) {
  const {checked = false, label = '', onCheck} = props;
  const checkBoxTheme = {tintColor: checked ? '#00a5ff' : null};
  return (
    <TouchableOpacity
      style={styles.checkBoxRoWContainer}
      onPress={() => onCheck(!checked)}>
      <Image
        style={[styles.checkBox, checkBoxTheme]}
        source={
          checked
            ? images.checkBox.checkbox_filled
            : images.checkBox.checkbox_empty
        }
      />

      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default class CheckboxGroup extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.array.isRequired,
    onCheckboxValueChanged: PropTypes.func,
    value: PropTypes.any,
    other: PropTypes.bool,
    toggle: PropTypes.bool,
    error: PropTypes.bool,
    required: PropTypes.bool
  };

  static defaultProps = {
    label: '',
    onCheckboxValueChanged: () => {},
    other: false,
    toggle: false,
    value: [],
    error: false,
    required : false
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedValues: this.props.value,
    };
  }

  onOtherTextChanged = text => {
    const {onCheckboxValueChanged} = this.props;
    const {selectedValues} = this.state;
    const clonedValues = _.cloneDeep(selectedValues);
    clonedValues.other.value = text;
    this.setState(
      {
        selectedValues: clonedValues,
      },
      () => {
        onCheckboxValueChanged(clonedValues);
      },
    );
  };

  onCheckChanged = (value, checked) => {
    const {onCheckboxValueChanged} = this.props;
    const {selectedValues} = this.state;
    const clonedValues = _.cloneDeep(selectedValues);
    if (checked) {
      if (value === 'other') {
        clonedValues.other = {
          value: '',
        };
      } else {
        clonedValues.push(value);
      }
    } else if (value === 'other') {
      // Remove other field from state
      delete clonedValues.other;
    } else {
      // Remove selected item from regular
      const index = clonedValues.indexOf(value);
      if (index !== -1) {
        clonedValues.splice(index, 1);
      }
    }
    this.setState(
      {
        selectedValues: clonedValues,
      },
      () => {
        onCheckboxValueChanged(clonedValues);
      },
    );
  };

  renderOtherInput = () => {
    const {selectedValues} = this.state;
    if (selectedValues.other) {
      return (
        <CustomInput
          keyboardType="default"
          validation={v => v}
          onChangeText={this.onOtherTextChanged}
        />
      );
    }
    return null;
  };

  render() {
    const {label, options, other, toggle, error} = this.props;
    const {theme} = this.context;
    const propsValue = this.props.value ? this.props.value : [];
    return (
      <View>
        <LabelError label={label} error={error} required = {this.props.required}/>

        <View style={styles.checkboxContainer}>
          {_.map(options, value => {
            let switchPadding = {paddingTop: toggle ? 10 : 0};
            return toggle ? (
              <View
                style={[styles.switchRow, switchPadding]}
                key={`${_.get(value, 'value')}`}>
                <Switch
                  onValueChange={checked => {
                    this.onCheckChanged(_.get(value, 'value'), checked);
                  }}
                  thumbTintColor={theme.toggle.knobColor}
                  onTintColor={theme.toggle.tintColor}
                  value={
                    propsValue.length ? propsValue.indexOf(_.get(value, 'value')) !== -1 : null
                  }
                />

                <Text style={styles.toggleText}>{_.get(value, 'label')}</Text>
              </View>
            ) : (
              <View key={`${_.get(value, 'value')}`}>
                <Checkbox
                  label={_.get(value, 'label')}
                  value={_.get(value, 'value')}
                  checked={
                    propsValue.length ? propsValue.indexOf(_.get(value, 'value')) !== -1 : null
                  }
                  onCheck={checked => {
                    this.onCheckChanged(_.get(value, 'value'), checked);
                  }}
                />
              </View>
            );
          })}

          {other ? (
            <View style={styles.otherRow}>
              {toggle ? (
                <View style={styles.switchRow}>
                  <Switch
                    thumbTintColor={theme.toggle.knobColor}
                    onTintColor={theme.toggle.tintColor}
                    onValueChange={checked => {
                      this.onCheckChanged('other', checked);
                    }}
                    value={Boolean(propsValue.other)}
                  />

                  <Text style={styles.toggleText}>Other</Text>
                </View>
              ) : (
                <Checkbox
                  label="Other"
                  value="other"
                  checked={Boolean(propsValue.other)}
                  onCheck={checked => {
                    this.onCheckChanged('other', checked);
                  }}
                />
              )}

              <View style={styles.container}>{this.renderOtherInput()}</View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
