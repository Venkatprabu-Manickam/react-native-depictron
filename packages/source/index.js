import React from 'react';
import { Alert, ScrollView, Text, View, DeviceEventEmitter } from 'react-native';
import PropTypes, { element } from 'prop-types';
import _ from 'lodash';
import { getInputType, validateExpression } from '../common/utils';
import { FORM_ELEMENT } from '../common/constants';
import { styles } from './styles';

import { buildTheme } from '../config/styles';

import CustomInput from './components/CustomInput';
import Button from './components/Button';
import Header from './components/Header';
import Paragraph from './components/Paragraph';
import NumberSelector from './components/NumberSelector';
import Ratings from './components/Rating';
import RadioGroup from './components/RadioGroup';
import CheckboxGroup from './components/CheckboxGroup';
import CustomDate from './components/CustomDate';
import Select from './components/Select';
import DocumentPicker from './components/DocumentPicker';
import DSection from './components/DSection';
import DSigleChoiceSelect from './components/SingleChoice';

const defaultTheme = buildTheme();

export class FormProvider extends React.PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    theme: PropTypes.object,
    onFormDataChange: PropTypes.func,
    submitButton: PropTypes.object,
    currentFormPage: PropTypes.number,
    onChangeFormPage: PropTypes.func,
    prevNavButtonStyle: PropTypes.object,
    nextNavButtonStyle: PropTypes.object,
    submitButtonStyle: PropTypes.object,
    showNavActions: PropTypes.bool,
    onSubmitResponse: PropTypes.func,
    enablePageValidation: PropTypes.bool
  };

  static defaultProps = {
    style: {},
    theme: defaultTheme,
    onFormDataChange: () => { },
    submitButton: {},
    currentFormPage: 1,
    onChangeFormPage: () => { },
    prevNavButtonStyle: {},
    nextNavButtonStyle: {},
    submitButtonStyle: {},
    showNavActions: true,
    onSubmitResponse: () => { },
    enablePageValidation: true
  };

  static childContextTypes = {
    theme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.totalPage = this.getTotalPages();
    this.state = {
      form: this.props.form,
      responses: this.poupulateDefaultFormFields(),
      requiredData: [],
      showError: [],
      totalPages: this.totalPage,
      currentPage: (this.props.currentFormPage > 0 && this.props.currentFormPage <= this.totalPage) ?
        this.props.currentFormPage : 1,
    };

    this.onPressChangeNextPage = this.onPressChangeNextPage.bind(this);
    this.onPressChangePrevPage = this.onPressChangePrevPage.bind(this);
  };

  getTotalPages() {
    let totalPage = this.props.form ? this.props.form.elements.length ? this.props.form.elements.length : 0 : 0;
    if (totalPage === 1) {
      this.props.onChangeFormPage({
        pageNo: 1,
        isEndPage: true
      })
    };

    return totalPage;
  };

  next = (enablePageValidation = true) => {
    if (enablePageValidation) {
      let enableAutoSwitchPage = true;
      this.validate(enableAutoSwitchPage);
    } else {
      this.onPressChangeNextPage();
    }
  };

  prev = () => {
    this.onPressChangePrevPage();
  };

  submit = () => {
    const { onSubmitResponse, enablePageValidation } = this.props;
    if (enablePageValidation) {
      let isValid = this.validate();
      if (isValid) {
        console.log("Form Response", this.state.responses);
        onSubmitResponse && onSubmitResponse(this.state.responses);
      }
    } else {
      console.log(this.state.responses)
    }
  };

  validate = (autoSwitchPage = true) => {
    const { currentPage, totalPages } = this.state;
    let requiredFields = this.grapRequiredField();
    let isValid = this.checkReuiredFieldsFiled(requiredFields);

    if (autoSwitchPage && isValid && currentPage < totalPages) {
      this.onPressChangeNextPage();
    }

    return isValid;
  };


  onPressChangeNextPage = () => {
    const { currentPage, totalPages } = this.state;
    if (currentPage < totalPages) {
      this.setState({
        currentPage: currentPage + 1,
        showError: []
      });

      // Info to user
      this.props.onChangeFormPage({
        pageNo: (currentPage + 1),
        totalPages,
        isEndPage: (currentPage + 1) === totalPages
      });
    }
  };

  onPressChangePrevPage = () => {
    const { currentPage, totalPages } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });

      // Info to user
      this.props.onChangeFormPage({
        pageNo: (currentPage - 1),
        totalPages,
        isEndPage: (currentPage - 1) === totalPages
      });
    }
  };

  getFormItemByPageNo(pageNo = this.state.currentPage) {
    const { form } = this.props;
    const { elements = [] } = form ? form : {};
    return pageNo <= elements.length ? elements[pageNo - 1] : [];
  }

  grapRequiredField(pageNo = this.state.currentPage) {

    let currentFormPage = this.getFormItemByPageNo(pageNo);
    let currentFormPageElements = currentFormPage["elements"] ? currentFormPage["elements"] : [];

    let keys = new Set();


    const iterateDSection = (elements) => {
      _.forEach(elements, (subElement) => extractComponents(subElement))
    };


    const extractComponents = (element) => {
      const { required = false, type, key, properties } = element;
      switch (type) {
        case FORM_ELEMENT.DSECTION:
          const { elements = [] } = element;
          if (properties.conditional) {
            let isConditionSatisfied = this.checkCondition(properties.conditional);
            if (isConditionSatisfied) iterateDSection(elements);
          } else {
            iterateDSection(elements);
          }
          break;
        default:
          if (required) {
            let isConditionSatisfied = this.checkCondition(properties.conditional);
            if (isConditionSatisfied) keys.add(key);
          }
          break;
      }
    }
    _.forEach(currentFormPageElements, (element) => extractComponents(element))
    return Array.from(keys);
  }

  getChildContext() {
    return {
      theme: this.props.theme,
    };
  }

  getFormElementLabel = item => item.label ? item.label : '';

  getFormElementValue = (key, element) => {
    const { responses } = this.state;
    let parentId = this.getCurrentPageId();
    let elementKey = parentId ? parentId : element.key;
    const formAnswer = _.get(_.get(responses, elementKey), element.key);
    if (!_.isEmpty(formAnswer)) {
      return formAnswer;
    }
    return _.get(element, 'value');
  };

  _getFormResponses = () => this.state.responses;


  populateDataFields(target, responses, pId) {
    let parentId = pId ? pId : this.getCurrentPageId();
    _.each(target, element => {
      let elementKey = parentId ? parentId : element.key;

      switch (element.type) {
        case FORM_ELEMENT.RADIO_GROUP:
          const selectedValue = _.find(element.values, value => value.selected);
          if (selectedValue) {

            let elementValue = _.get(responses, elementKey) ? _.get(responses, elementKey) : {};
            // let subObject = {};
            // subObject["userAnswer"] = selectedValue.value;
            elementValue[element.key] = selectedValue.value;
            _.set(responses, elementKey, elementValue);
          }
          break;
        case FORM_ELEMENT.RATINGS:
        case FORM_ELEMENT.NUMEBR:
        case FORM_ELEMENT.DATE:
        case FORM_ELEMENT.TEXT_INPUT:
        case FORM_ELEMENT.MULTILINE_INPUT:
          if (element.value) {
            let elementValue = _.get(responses, elementKey) ? _.get(responses, elementKey) : {};
            elementValue[element.key] = element.value;
            _.set(responses, elementKey, elementValue);
          }
          break;
        case FORM_ELEMENT.SELECT:
          const selectedValues = _.filter(
            element.values,
            value => value.selected,
          );
          if (!_.isEmpty(selectedValues)) {

            let elementValue = _.get(responses, elementKey) ? _.get(responses, elementKey) : {};
            // let subObject = {};
            // subObject["userAnswer"] = [];
            elementValue[element.key] = [];
            _.set(responses, elementKey, elementValue);

            _.each(selectedValues, value => {
              let data = _.get(_.get(responses, elementKey), element.key);
              data.push(value.value);
            });
          }
          break;
        case FORM_ELEMENT.CHECK_BOX_GROP:
          const valuesSelected = _.filter(
            element.values,
            value => value.selected,
          );
          if (!_.isEmpty(valuesSelected)) {

            let elementValue = _.get(responses, elementKey) ? _.get(responses, elementKey) : {};
            // let subObject = {};
            // subObject["userAnswer"] = { regular: [] };
            elementValue[element.key] = [];
            _.set(responses, elementKey, elementValue);

            _.each(valuesSelected, value => {
              let data = _.get(_.get(responses, elementKey), element.key);
              data.push(value.value);
            });
          }
          break;

        case FORM_ELEMENT.DSECTION:
          const { elements = [] } = element;
          if (elements.length) {
            responses = this.populateDataFields(elements, responses);
          }
          break;

        case FORM_ELEMENT.DSINGLE_CHOICE:
          const selectedChoice = _.find(element.choices, value => value.selected);
          if (selectedChoice) {

            let elementValue = _.get(responses, elementKey) ? _.get(responses, elementKey) : {};
            // let subObject = {};
            // subObject["userAnswer"] = selectedChoice.value;
            elementValue[element.key] = selectedChoice.value;

            _.set(responses, elementKey, elementValue);
          }
          break;
        default:
          break;
      }
    });

    return responses;
  }

  poupulateDefaultFormFields = () => {
    const { form } = this.props;
    // Empty responses object
    let responses = {};
    _.each(form.elements, (form) => {
      responses = this.populateDataFields(form.elements, responses, form.key);
    })

    // Loop through form to populate default values
    return responses;
  };

  getCurrentPageId = () => {
    let currentPage = _.has(this.state, "currentPage") ? this.state.currentPage : 1;
    let currentFormPage = this.getFormItemByPageNo(currentPage);
    return currentFormPage.key;
  }

  updateFormElement = (value, element) => {
    const { onFormDataChange } = this.props;
    const { responses } = this.state;
    const clonedResponses = _.cloneDeep(responses);
    const parentId = this.getCurrentPageId();
    let elementKey = parentId ? parentId : element.key;


    let elementValue = _.get(clonedResponses, elementKey) ? _.get(clonedResponses, elementKey) : {};
    elementValue[element.key] = value;
    _.set(clonedResponses, elementKey, elementValue);

    console.log('Data changes...');
    this.setState(
      {
        responses: clonedResponses,
      },
      () => {
        /*
         * If listener is set on form data changes,
         * propagate back to parent component
         */
        if (onFormDataChange) {
          onFormDataChange(this.state.responses);
        }
      },
    );
  };


  checkReuiredFieldsFiled = (target = []) => {
    const showError = [];
    const currentFormPage = this.getFormItemByPageNo();
    let currentPageUserInputs = _.get(this.state.responses, currentFormPage.key);
    _.forEach(target, element => {
      const key = element;
      if (!currentPageUserInputs || !currentPageUserInputs[key]) {
        if (!showError.includes(key)) {
          showError.push(key);
        }
      } else if (showError.includes(key)) {
        const index = showError.indexOf(key);
        showError.splice(index, 1);
      }
    });
    this.setState({ showError });
    if (showError.length === 0) {
      return true;
    } else {
      Alert.alert('Alert', 'Please fill required fields!');
      return false
    }
  };

  getFormSectionElement = (element) => element.elements ? element.elements : [];

  renderFormElements(element) {
    {
      const { type } = element;
      switch (type) {
        case FORM_ELEMENT.DSECTION:
          return this.renderDSection(element);

        case FORM_ELEMENT.HEADER:
          return this.renderHeader(element);

        case FORM_ELEMENT.PARAGRAPGH:
          return this.renderParagraph(element);

        case FORM_ELEMENT.TEXT_INPUT:
          return this.renderTextInput(element);

        case FORM_ELEMENT.MULTILINE_INPUT:
          return this.renderMultilineTextInput(element);

        case FORM_ELEMENT.NUMEBR:
          return this.renderNumberStepper(element);

        case FORM_ELEMENT.RATINGS:
          return this.renderRatings(element);

        case FORM_ELEMENT.RADIO_GROUP:
          return this.renderRadioGroup(element);

        case FORM_ELEMENT.CHECK_BOX_GROP:
          return this.renderCheckBoxGroup(element);

        case FORM_ELEMENT.DATE:
          return this.renderDatePicker(element);

        case FORM_ELEMENT.SELECT:
          return this.renderSelect(element);

        case FORM_ELEMENT.FILE_PICKER:
          return this.renderFilePicker(element);

        case FORM_ELEMENT.DSINGLE_CHOICE:
          return this.renderDSingleChoice(element)

        default:
          return null;
      }
    }
  };

  checkCondition = (conditional = {}) => {
    const { parent, eq, when } = conditional;
    if (!parent && !when) return true;
    let dependentParentDic = parent ? _.get(this.state.responses, parent) : null;
    let dependentFieldValue = dependentParentDic ? dependentParentDic[when] : "";

    return _.lowerCase(dependentFieldValue) === _.lowerCase(eq);
  }

  updateRelationalFieldValue = (element = {}) => {

    const checkRelationFieldValue = (subElement, parent = "") => {
      if (_.has(this.state.responses, parent)) {
        let parentDic = _.get(this.state.responses, parent);
        if (_.has(parentDic, subElement.key)) {
          let targetKey = subElement.key;
          let targetValue = _.get(parentDic, targetKey);
          switch (typeof targetValue) {
            case 'object':
              if (Array.isArray(targetValue)) {
                delete parentDic[targetKey]
              } else {
                delete parentDic[targetKey]
              }
              break;
            case 'string':
              delete parentDic[targetKey]
              break;
            default:
              break;
          }
          _.set(this.state.responses, parent, parentDic);
        }
      }
    };

    const { elements = [], properties = {} } = element;
    const { conditional = {} } = properties;
    const { parent } = conditional;

    switch (element.type) {
      case FORM_ELEMENT.DSECTION:
        _.forEach(elements, (sectionElement) => checkRelationFieldValue(sectionElement, parent))
        break;
      default:
        checkRelationFieldValue(element, parent);
        break;
    }
  }

  getRelativeFiledStyle(element = {}) {
    const { properties = {}, clearOnHide } = element;
    const { conditional } = properties;
    let relativeStyle = {};
    let isConditionSatisfied = this.checkCondition(conditional)
    if (isConditionSatisfied) {
      relativeStyle = { display: "flex" };
    } else {
      if (clearOnHide) this.updateRelationalFieldValue(element);
      relativeStyle = { display: "none" };
    }
    return relativeStyle;
  };

  renderHeader = (element) => {
    const { key, subtype, style } = element;
    const label = this.getFormElementLabel(element);
    return (
      <View key={key} style={styles.row}>
        <Header label={label} subType={subtype} style={style} />
      </View>
    )
  };

  renderParagraph = (element) => {
    const { key, subtype, style } = element;
    const label = this.getFormElementLabel(element);

    return (
      <View key={key} style={styles.row}>
        <Paragraph label={label} style={style} />
      </View>
    )
  };

  renderDSection(element) {
    const { key, subtype, properties } = element;
    const sectionElements = this.getFormSectionElement(element);

    const createBaseViewStyle = (styleProps, numberOfItems) => {
      const { width, visible = true, style = {} } = styleProps;
      const { orientation } = properties;
      let viewStyle = {};
      viewStyle.display = visible ? "flex" : "none";
      viewStyle.width = width ? width : orientation ? (orientation === "horizontal" ? `${100 / numberOfItems}%` : 'auto') : 'auto';
      return { ...viewStyle, ...style };
    };

    let numberOfItems = sectionElements.length ? sectionElements.length : 0;


    return (
      <DSection
        key={key}
        {...properties}
        style={this.getRelativeFiledStyle(element)}>
        {
          _.map(sectionElements, element => {
            return (
              <View
                key={element.key}
                style={createBaseViewStyle(element.properties, numberOfItems)}
                pointerEvents={element.properties.enabled ? 'auto' : "none"}>
                {this.renderFormElements(element)}
              </View>
            )
          })
        }
      </DSection>
    );
  };


  renderTextInput(element) {
    const { key, subtype, properties, required } = element;
    const label = this.getFormElementLabel(element);
    const moreOptions = {};
    if (element.maxlength) {
      moreOptions.maxLength = Number(element.maxlength);
    }

    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <CustomInput
          {...moreOptions}
          style={properties.inputStyle}
          onChangeText={value => {
            this.updateFormElement(value, element);
          }}
          value={this.getFormElementValue(key, element)}
          label={label}
          keyboardType={getInputType(element.subtype)}
          validation={element.validationFunc}
          password={element.subtype === 'password'}
          placeholder={element.placeholder}
          disabled={element.disabled}
          icon={element.icon}
          error={this.state.showError.includes(key)}
          required={required}
          serialNumber={properties.sno}
          masked
        />
      </View>
    );
  };

  renderMultilineTextInput(element) {
    const { key, subtype, properties, required } = element;
    const label = this.getFormElementLabel(element);
    const textAreaOptions = {};
    if (element.maxlength) {
      textAreaOptions.maxLength = Number(element.maxlength);
    }
    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <CustomInput
          {...textAreaOptions}
          style={properties.inputStyle}
          onChangeText={value => {
            this.updateFormElement(value, element);
          }}
          multiline
          value={this.getFormElementValue(key, element)}
          label={label}
          keyboardType="default"
          validation={element.validationFunc}
          placeholder={element.placeholder}
          disabled={element.disabled}
          error={this.state.showError.includes(key)}
          required={required}
        />
      </View>
    );
  };

  renderNumberStepper(element) {
    const { key, subtype, style, required, properties } = element;
    const label = this.getFormElementLabel(element);
    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <NumberSelector
          label={label}
          required={required}
          disabled={element.disabled}
          placeholder={element.placeholder}
          onNumberChanged={value => {
            this.updateFormElement(value, element);
          }}
          min={element.min}
          max={element.max}
          step={element.step}
          directTextEdit={element.directTextEdit}
          value={(() => {
            const number = Number(this.getFormElementValue(key, element));
            if (isNaN(number)) {
              return element.min;
            }
            if (number < element.min) {
              return element.min;
            }
            if (number > element.max) {
              return element.max;
            }
            return number;
          })()}
          error={this.state.showError.includes(key)}
        />
      </View>
    );
  };

  renderRatings(element) {
    const { key, subtype, style, required, properties } = element;
    const label = this.getFormElementLabel(element);

    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <Ratings
          type="star"
          starCount={(() => {
            const maxStars = element.maxStars || 5;
            const starCount = Number(
              this.getFormElementValue(key, element),
            );
            if (isNaN(starCount)) {
              return 0;
            }
            return starCount > maxStars ? 0 : starCount;
          })()}
          label={label}
          onStarRatingChange={starCount => {
            this.updateFormElement(starCount, element);
          }}
          maxStars={element.maxStars}
          config={element.config}
          error={this.state.showError.includes(key)}
          required={required}
        />
      </View>
    );
  };

  renderRadioGroup(element) {
    const { key, subtype, style, required, properties } = element;
    const label = this.getFormElementLabel(element);
    const radioOptions = {};
    if (element.other) {
      radioOptions.other = element.other;
    }

    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <RadioGroup
          {...radioOptions}
          label={label}
          options={element.values}
          value={this.getFormElementValue(key, element)}
          onRadioValueChanged={value => {
            this.updateFormElement(value, element);
          }}
          error={this.state.showError.includes(key)}
          required={required}
        />
      </View>
    );
  };

  renderCheckBoxGroup(element) {
    const { key, subtype, style, required, properties } = element;
    const label = this.getFormElementLabel(element);
    const checkOptions = {};
    if (element.other) {
      checkOptions.other = element.other;
    }
    if (element.toggle) {
      checkOptions.toggle = element.toggle;
    }

    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <CheckboxGroup
          {...checkOptions}
          label={label}
          options={element.values}
          onCheckboxValueChanged={value => {
            this.updateFormElement(value, element);
          }}
          value={this.getFormElementValue(key, element)}
          error={this.state.showError.includes(key)}
          required={required}
        />
      </View>
    );
  };

  renderDatePicker(element) {
    const { key, subtype, style, required, properties } = element;
    const label = this.getFormElementLabel(element);

    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <CustomDate
          placeholder={element.placeholder}
          label={label}
          value={this.getFormElementValue(key, element)}
          onDateChange={value => {
            this.updateFormElement(value, element);
          }}
          disabled={element.disabled}
          minDate={element.minDate}
          maxDate={element.maxDate}
          dateFormat={element.dateFormat}
          error={this.state.showError.includes(key)}
          required={required}
        />
      </View>
    );
  };

  renderSelect(element) {
    const { key, subtype, properties, required } = element;
    const label = this.getFormElementLabel(element);

    const multiOptions = {
      single: !element.multiple,
    };

    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <Select
          {...multiOptions}
          searchInputPlaceholder={element.searchInputPlaceholder}
          data={element.values}
          label={label}
          values={this.getFormElementValue(key, element)}
          onSelect={value => {
            this.updateFormElement(value, element);
          }}
          error={this.state.showError.includes(key)}
          required={required}
          style={properties.inputStyle}
        />
      </View>
    );
  };

  renderFilePicker(element) {
    const { key, subtype, style, required, properties } = element;
    const label = this.getFormElementLabel(element);

    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <DocumentPicker
          label={label}
          multiSelection={element.multiSelection}
          fileType={element.fileType}
          allFilesType={element.allowAlltype}
          onSelectFile={picked => this.updateFormElement(picked, element)}
          disabled={element.disabled}
          error={this.state.showError.includes(key)}
          required={required}
        />
      </View>
    );
  };

  renderDSingleChoice(element) {
    const { key, style, required, choices = [], properties } = element;
    const label = this.getFormElementLabel(element);
    return (
      <View key={key} style={[styles.row, this.getRelativeFiledStyle(element)]}>
        <DSigleChoiceSelect
          label={this.getFormElementLabel(element)}
          value={this.getFormElementValue(key, element)}
          error={this.state.showError.includes(key)}
          required={required}
          choices={choices}
          onSelect={(value) => {
            this.updateFormElement(value, element);
          }}
        />
      </View>
    );
  }



  renderForm = () => {
    const { form } = this.state;
    const { elements = [] } = form ? form : {};

    let dPages = [];
    _.map(elements, dpage => {
      const { elements = [] } = dPages ? dpage : {};
      const formElements = _.map(elements, element => this.renderFormElements(element));
      dPages.push(formElements);
    })

    return (dPages.length && this.state.currentPage <= dPages.length) ? dPages[this.state.currentPage - 1] : dPages[0];
  };

  render() {
    const {
      showNavActions,
      prevNavButtonStyle,
      nextNavButtonStyle,
      submitButtonStyle,
      enablePageValidation
    } = this.props;

    const { currentPage, totalPages } = this.state;
    let prevBtnDisplay = { display: currentPage > 1 ? "flex" : "none" };
    let nextBtnDisplay = { display: currentPage < totalPages ? "flex" : "none" };
    let submitBtnDisplay = { display: currentPage === totalPages ? "flex" : "none" };

    return (
      <View style={[styles.container, this.props.style]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderForm()}

          <View key="default_actionbutton" style={[styles.actionButtonContainer, { display: showNavActions ? "flex" : "none" }]}>
            <Button
              label={"Prev"}
              onPress={this.prev}
              buttonStyle={[styles.buttonStyle, prevBtnDisplay, prevNavButtonStyle]}
              buttonTextStyle={styles.buttonTextStyle}
            />
            <Button
              label={"Next"}
              onPress={() => this.next(enablePageValidation)}
              buttonStyle={[styles.buttonStyle, nextBtnDisplay, nextNavButtonStyle]}
              buttonTextStyle={styles.buttonTextStyle}
            />
            <Button
              label={"Submit"}
              onPress={this.submit}
              buttonStyle={[styles.buttonStyle, submitBtnDisplay, submitButtonStyle]}
              buttonTextStyle={styles.buttonTextStyle}
            />
          </View>

        </ScrollView>
      </View>
    );
  }
}