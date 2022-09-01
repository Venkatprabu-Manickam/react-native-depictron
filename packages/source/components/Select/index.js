import React, {PureComponent} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import MultiSelect from '../MultiSelect';

import LabelError from '../LabelError';
import {styles} from './styles';

export default class Select extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    label: PropTypes.string,
    values: PropTypes.array,
    onSelect: PropTypes.func,
    single: PropTypes.bool,
    searchInputPlaceholder: PropTypes.string,
    error: PropTypes.bool,
    required : PropTypes.bool,
    style : PropTypes.object
  };

  static defaultProps = {
    label: '',
    values: [],
    single: true,
    searchInputPlaceholder: 'Search Items...',
    onSelect: () => {},
    error: false,
    required : false,
    style : {}
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired,
  };

  onSelectedItemsChange = selectedItems => {
    const {onSelect} = this.props;
    onSelect(selectedItems);
  };

  render() {
    const {label, values, data, single, searchInputPlaceholder, error, style} =
      this.props;
    const {
      theme: {
        select: {
          tagRemoveIconColor,
          tagBorderColor,
          tagTextColor,
          selectedItemTextColor,
          selectedItemIconColor,
          itemTextColor,
          submitButtonColor,
        },
      },
    } = this.context;
    return (
      <View>
        <LabelError label={label} error={error} required = {this.props.required}/>

        <View style={[styles.maginTop10, style]}>
          <MultiSelect
            hideSubmitButton
            autoFocusInput={false}
            single={single}
            items={data}
            uniqueKey="value"
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={values}
            selectText="Pick Item(s)"
            searchInputPlaceholderText={searchInputPlaceholder}
            tagRemoveIconColor={tagRemoveIconColor}
            tagBorderColor={tagBorderColor}
            tagTextColor={tagTextColor}
            selectedItemTextColor={selectedItemTextColor}
            selectedItemIconColor={selectedItemIconColor}
            itemTextColor={itemTextColor}
            displayKey="label"
            searchInputStyle={styles.colorBlack}
            submitButtonColor={submitButtonColor}
            submitButtonText="OK"
          />
        </View>
      </View>
    );
  }
}
