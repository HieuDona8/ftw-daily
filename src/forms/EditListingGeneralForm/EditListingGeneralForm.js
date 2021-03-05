import React from 'react';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { maxLength, required, composeValidators } from '../../util/validators';
import { Form, Button, FieldTextInput, FieldCheckboxGroup } from '../../components';
import CustomCategorySelectFieldMaybe from './CustomCategorySelectFieldMaybe';
import config from '../../config';
import { findOptionsForSelectFilter } from '../../util/search';
import arrayMutators from 'final-form-arrays';

import css from './EditListingGeneralForm.module.css';

const TITLE_MAX_LENGTH = 60;
const FEATURES_NAME_SUBJECTS = 'subjects';
const FEATURES_NAME_LEVELS = 'levels';

const EditListingGeneralFormComponent = props => (
  <FinalForm
    {...props}
    mutators={{ ...arrayMutators }}
    render={formRenderProps => {
      const {
        categories,
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
        nameSubjects,
        nameLevels,
        lableSubject,
        lableLevel 
      } = formRenderProps;

      const nameMessage = intl.formatMessage({ id: 'EditListingGeneralForm.name' });
      const namePlaceholderMessage = intl.formatMessage({
        id: 'EditListingGeneralForm.namePlaceholder',
      });
      const nameRequiredMessage = intl.formatMessage({
        id: 'EditListingGeneralForm.nameRequired',
      });
      const maxLengthMessage = intl.formatMessage(
        { id: 'EditListingGeneralForm.maxLength' },
        {
          maxLength: TITLE_MAX_LENGTH,
        }
      );

      const bioTitleMessage = intl.formatMessage({
        id: 'EditListingGeneralForm.bioTitle',
      });
      const bioPlaceholderMessage = intl.formatMessage({
        id: 'EditListingGeneralForm.bioPlaceholder',
      });
      const maxLength60Message = maxLength(maxLengthMessage, TITLE_MAX_LENGTH);
      const bioRequiredMessage = intl.formatMessage({
        id: 'EditListingGeneralForm.bioRequired',
      });

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

      return (
        <Form className={classes} onSubmit={handleSubmit}>
          {errorMessageCreateListingDraft}
          {errorMessageUpdateListing}
          {errorMessageShowListing}

          <FieldTextInput
            id="name"
            name="name"
            className={css.name}
            type="text"
            label={nameMessage}
            placeholder={namePlaceholderMessage}
            maxLength={TITLE_MAX_LENGTH}
            validate={composeValidators(required(nameRequiredMessage), maxLength60Message)}
            autoFocus
          />

          <FieldTextInput
            id="bio"
            name="bio"
            className={css.bio}
            type="textarea"
            label={bioTitleMessage}
            placeholder={bioPlaceholderMessage}
            validate={composeValidators(required(bioRequiredMessage))}
          />

          <FieldCheckboxGroup className={css.features} id={nameSubjects} label={lableSubject} name={nameSubjects} options={optionSubjects} />
          <FieldCheckboxGroup className={css.features} id={nameLevels} label={lableLevel} name={nameLevels} options={optionLevels} />


          <CustomCategorySelectFieldMaybe
            id="category"
            name="category"
            categories={categories}
            intl={intl}
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
);

EditListingGeneralFormComponent.defaultProps = { 
  className: null, 
  fetchErrors: null,
  filterConfig: config.custom.filters,
  nameSubjects: "subject",
  nameLevels: 'levels',
  lableSubject: 'Your subject',
  lableLevel: 'Levels, you can teach'
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
};

export default compose(injectIntl)(EditListingGeneralFormComponent);
