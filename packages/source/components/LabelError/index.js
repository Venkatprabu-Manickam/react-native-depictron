import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { red700 } from '../../../config/colors';

export default class LabelError extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    error: PropTypes.bool,
    required: PropTypes.bool
  };

  static defaultProps = {
    label: '',
    error: false,
    required: false
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired,
  };

  render() {
    const { label, error } = this.props;
    const { theme } = this.context;

    return (
      <View>
        {label ? <Text style={theme.label}>
          {label}
          {this.props.required ? <Text style={style.requiredSymbol}>*</Text> : null}
        </Text> : null}

        {error ? <Text style={theme.error}>Required</Text> : null}
      </View>
    );
  }
};

const style = StyleSheet.create({
  requiredSymbol: {
    fontSize: 18,
    color: red700,
    textAlign : 'center'
  }
})
