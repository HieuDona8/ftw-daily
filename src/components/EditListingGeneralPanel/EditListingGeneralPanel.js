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
  const { description, title, publicData } = currentListing.attributes;

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
      label: 'Your subject'
    },
    levels: {
      name: 'levels',
      label: 'Levels, you can teach'
    },
    time1: {
      name: 'time-type',
      label: "Full time",
      value: '1'
    },
    time0: {
      name: 'time-type',
      label: "Part time",
      value: '0'
    },
    numberHour: {
      name: 'time-teaching',
      label: "Custom time teaching",
      type: "number"
    }
  }

  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingGeneralForm
        className={css.form}
        infoForm={infoForm}
        //initialValues={{ name: publicData.name, bio: publicData.bio, : publicData.category }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { name: title, bio: description, ...general } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: { general },
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
