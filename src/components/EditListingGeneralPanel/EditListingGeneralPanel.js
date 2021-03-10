import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingGeneralForm } from '../../forms';
import config from '../../config';
import { compose } from 'redux';

import css from './EditListingGeneralPanel.module.css';

const EditListingGeneralPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
    intl
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const {publicData} = currentListing.attributes || {};
  const typeListing = 'teacher';

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingGeneralPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingGeneralPanel.createListingTitle" />
  );

  const categoryOptions = findOptionsForSelectFilter('category', config.custom.filters);
  
  const infoForm = {
    name: {
      name: 'name',
      label: intl.formatMessage({ id: 'EditListingGeneralForm.name' }),
      placeholder: intl.formatMessage({id: 'EditListingGeneralForm.namePlaceholder',}),
      requiredMessage: intl.formatMessage({id: 'EditListingGeneralForm.nameRequired'})
    },
    bio: {
      name: 'bio',
      label: intl.formatMessage({id: 'EditListingGeneralForm.bioTitle'}),
      placeholder: intl.formatMessage({id: 'EditListingGeneralForm.bioPlaceholder'}),
      requiredMessage: intl.formatMessage({id: 'EditListingGeneralForm.bioRequired'})
    },
    subjects: {
      name: 'subject',
      label: 'Your subject',
      requiredMessage: intl.formatMessage({id: 'EditListingGeneralForm.subjectsRequired'})
    },
    levels: {
      name: 'levels',
      label: 'Levels, you can teach',
      requiredMessage: intl.formatMessage({id: 'EditListingGeneralForm.levelsRequired'})
    },
    timeFull: {
      name: 'timeType',
      label: "Full time",
      value: 'full',
      requiredMessage: intl.formatMessage({id: 'EditListingGeneralForm.typeTimeRequired'}),
    },
    timePart: {
      name: 'timeType',
      label: "Part time",
      value: 'part',
      requiredMessage: intl.formatMessage({id: 'EditListingGeneralForm.typeTimeRequired'}),
    },
    numberHour: {
      name: 'numberHour',
      label: "Custom time teaching",
      type: "number",
      maxValue: 8,
      minValue: 1,
      requiredMessage: intl.formatMessage({id: 'EditListingGeneralForm.hourRequired'}),
      maxMessage: intl.formatMessage({id: 'EditListingGeneralForm.hourMax'},  {time: 8}),
      minMessage: intl.formatMessage({id: 'EditListingGeneralForm.hourMin'}, {time: 1}),
      value: 8
    }
  }

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingGeneralForm
        className={css.form}
        infoForm={infoForm}
        initialValues={publicData.general ? { 
          [infoForm.name.name]: currentListing.attributes.title, 
          [infoForm.bio.name]: currentListing.attributes.description,
          [infoForm.subjects.name]: publicData.general.subject,
          [infoForm.levels.name]: publicData.general.levels,
          [infoForm.timeFull.name]: publicData.general.timeType,
          [infoForm.numberHour.name]: publicData.general.numberHour,
        }: {}}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { name: title, bio: description, ...general } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: { 
              general,
              type: typeListing
            },
          };
          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={categoryOptions}
      />
    </div>
  );
};

EditListingGeneralPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingGeneralPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,
  intl: intlShape.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default compose(injectIntl)(EditListingGeneralPanel);
