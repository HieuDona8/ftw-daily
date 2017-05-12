import React from 'react';
import { renderDeep } from '../../util/test-helpers';
import { fakeIntl, fakeFormProps } from '../../util/test-data';
import EditListingDescriptionForm from './EditListingDescriptionForm';

const noop = () => null;

describe('EditListingDescriptionForm', () => {
  it('matches snapshot', () => {
    const tree = renderDeep(
      <EditListingDescriptionForm
        {...fakeFormProps}
        intl={fakeIntl}
        dispatch={noop}
        onSubmit={v => v}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
