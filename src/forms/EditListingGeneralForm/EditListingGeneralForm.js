import React, {useRef} from 'react';
import { arrayOf, bool, func, object, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators, maxValue, minValue } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldCheckboxGroup, FieldRadioButton } from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import config from '../../config';
import { findOptionsForSelectFilter } from '../../util/search';
import arrayMutators from 'final-form-arrays';

import css from './EditListingGeneralForm.module.css';

const TITLE_MAX_LENGTH = 60;

const EditListingGeneralFormComponent = props => {

  return <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        updated,
        updateInProgress,
        fetchErrors,
        filterConfig,
        infoForm,
        values,
        form
      } = formRenderProps;

      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingGeneralForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
      const { updateListingError, createListingDraftError, showListingsError } = fetchErrors || {};
      const errorMessageUpdateListing = updateListingError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingGeneralForm.updateFailed" />
        </p>
      ) : null;

      // This error happens only on first tab (of EditListingWizard)
      const errorMessageCreateListingDraft = createListingDraftError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingGeneralForm.createListingDraftError" />
        </p>
      ) : null;

      const errorMessageShowListing = showListingsError ? (
        <p className={css.error}>
          <FormattedMessage id="EditListingGeneralForm.showListingFailed" />
        </p>
      ) : null;

      const optionSubjects = findOptionsForSelectFilter('subjects', filterConfig);
      const optionLevels = findOptionsForSelectFilter('levels', filterConfig);

      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      
      const handleChange = (property) => {
        const {values} = property
        
        if(values.timeType === 'full') {
          form.change(infoForm.numberHour.name, '8')
        }
      }
      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}

          <FieldTextInput
            id={infoForm.name.name}
            name={infoForm.name.name}
            className={css.name}
            type="text"
            label={infoForm.name.label}
            placeholder={infoForm.name.placeholder}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(infoForm.name.requiredMessage), maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id={infoForm.bio.name}
            name={infoForm.bio.name}
            className={css.bio}
            type="textarea"
            label={infoForm.bio.label}
            placeholder={infoForm.bio.placeholder}
            validate={composeValidators(required(infoForm.bio.requiredMessage))}
          />

          <FieldCheckboxGroup  
            id={infoForm.subjects.name} 
            label={infoForm.subjects.label} 
            name={infoForm.subjects.name} 
            className={css.features}
            options={optionSubjects} 
            validate={required(infoForm.subjects.requiredMessage)}
          />

          <FieldCheckboxGroup 
            className={css.features} 
            id={infoForm.levels.name} 
            label={infoForm.levels.label} 
            name={infoForm.levels.name} 
            options={optionLevels} 
            validate={required(infoForm.levels.requiredMessage)}
          />

          <FormSpy onChange={handleChange}/>
          <div>
            <label>Teaching hours</label>
            <FieldRadioButton
              id={`${infoForm.timeFull.name}+'1'`}
              name={infoForm.timeFull.name}
              label={infoForm.timeFull.label}
              value={infoForm.timeFull.value}
              //showAsRequired={showAsRequired}
              validate={required(infoForm.numberHour.requiredMessage)}
            />
            <FieldRadioButton
              id={`${infoForm.timePart.name}+'0'`}
              name={infoForm.timePart.name}
              label={infoForm.timePart.label}
              value={infoForm.timePart.value}
              validate={required(infoForm.numberHour.requiredMessage)}

              //showAsRequired={showAsRequired}
            />
          </div>
          
          <FieldTextInput
            className={css.field}
            type="number"
            id={infoForm.numberHour.name}
            name={infoForm.numberHour.name}
            label={infoForm.numberHour.label}
            validate={composeValidators(
              required(infoForm.numberHour.requiredMessage),
              maxValue(infoForm.numberHour.maxMessage,infoForm.numberHour.maxValue),
              minValue(infoForm.numberHour.minMessage,infoForm.numberHour.minValue)
            )}
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
  };

EditListingGeneralFormComponent.defaultProps = { 
  className: null, 
  fetchErrors: null,
  filterConfig: config.custom.filters,
};

EditListingGeneralFormComponent.propTypes = {
  className: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    createListingDraftError: propTypes.error,
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
  categories: arrayOf(
    shape({
      key: string.isRequired,
      label: string.isRequired,
    })
  ),
  filterConfig: propTypes.filterConfig,
  infoForm: object.isRequired
};

export default compose(injectIntl)(EditListingGeneralFormComponent);
