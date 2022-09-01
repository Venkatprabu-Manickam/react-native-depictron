import React from 'react';
import PropTypes, {string} from 'prop-types';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import FilePicker, {isInProgress} from 'react-native-document-picker';
import _ from 'lodash';
import FileViewer from 'react-native-file-viewer';
import {styles} from './styles';
import LabelError from '../LabelError';
import {getDocumentPicekerFileType} from '../../utils';
import images from '../../../assert';

function FilePreview({type, uri}) {
  switch (type) {
    case 'image/jpeg':
      return <Image style={styles.preview} source={{uri}} />;
    default:
      return <Image style={styles.preview} source={images.icon.doc} />;
  }
}

export default class DocumentPicker extends React.Component {
  static propsType = {
    label: PropTypes.string,
    required: PropTypes.bool,
    multiSelection: PropTypes.bool,
    disabled: PropTypes.bool,
    fileType: PropTypes.array[string],
    allFilesType: PropTypes.bool,
    error: PropTypes.bool,
    onSelectFile: PropTypes.func,
    required : PropTypes.bool
  };

  static defaultProps = {
    label: 'Please select photo to upload',
    required: false,
    disabled: false,
    multiSelection: false,
    fileType: ['images'],
    allFilesType: false,
    error: false,
    onSelectFile: () => {},
    required : false
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
  }

  async onClickAddFile(types) {
    const {multiSelection, onSelectFile} = this.props;
    try {
      const pickerResult = await FilePicker.pick({
        allowMultiSelection: multiSelection,
        type: types,
      });
      this.setState({result: pickerResult});
      onSelectFile(pickerResult);
      console.log('Picked Item', pickerResult);
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(err) {
    if (FilePicker.isCancel(err)) {
      console.warn('cancelled');
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  }

  async openFile(res) {
    try {
      await FileViewer.open(res.uri);
    } catch (e) {
      console.warn('Error in open doc : ', e);
    }
  }

  renderPickedFiles() {
    return (
      <View>
        {_.map(this.state.result, (element, identy) => {
          const {name, uri, type} = element;
          return (
            <View key={identy} style={styles.fileContainer}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => this.openFile(element)}>
                <FilePreview type={type} uri={uri} />

                <Text style={styles.file}>{name} - </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.removePickedItem(identy)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }

  removePickedItem(index) {
    const {onSelectFile} = this.props;
    const items = this.state.result;
    items.splice(index, 1);
    this.setState({result: items});
    onSelectFile(items);
  }

  render() {
    const {theme} = this.context;
    const {fileType, allFilesType, disabled} = this.props;
    const documentTypes = getDocumentPicekerFileType(fileType, allFilesType);
    return (
      <View style={styles.container}>
        <LabelError label={this.props.label} error={this.props.error} required = {this.props.required}/>

        {this.state.result.length === 0 ? (
          <TouchableOpacity 
          onPress={() => this.onClickAddFile(documentTypes)} 
          disabled = {disabled} style = {[styles.uploadContainer,disabled && styles.disabledOpacity]}>
            <Text style={[theme.label, styles.addButton]}>
              Tap to Upload
            </Text>
          </TouchableOpacity>
        ) : null}

        {this.renderPickedFiles()}
      </View>
    );
  }
}
