import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { richText } from '../../util/richText';
import { PropertyGroup } from '../../components';

import css from './ListingTeacherPage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION = 20;

const SectionGeneral = props => {
  const { description, generalService } = props;

  return (
    <div>
      <div className={css.sectionDescription}>
        <h2 className={css.descriptionTitle}>
          <FormattedMessage id="ListingTeacherPage.generalTitle" />
        </h2>
        <p className={css.description}>
          {richText(description, {
            longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
            longWordClass: css.longWord,
          })}
        </p>
      </div>

      <div className={css.sectionDescription}>
        <h2 className={css.descriptionTitle}>
          <FormattedMessage id="ListingTeacherPage.generalSubjects" />
        </h2>
        <PropertyGroup
          id="ListingTeacherPage.subjects"
          options={generalService.options.subjects}
          selectedOptions={generalService.data.subjects}
          twoColumns={false}
        />
      </div>

      <div className={css.sectionDescription}>
        <h2 className={css.descriptionTitle}>
          <FormattedMessage id="ListingTeacherPage.generalLevels" />
        </h2>
        <PropertyGroup
          id="ListingTeacherPage.levels"
          options={generalService.options.levels}
          selectedOptions={generalService.data.levels}
          twoColumns={false}
        />
      </div>

      <div className={css.sectionDescription}>
        <h2 className={css.descriptionTitle}>
          <FormattedMessage id="ListingTeacherPage.generalTeaching" />
        </h2>
        <label>Type teaching:</label>
        <p className={css.description}>
          {richText(generalService.data.timeType, {
            longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
            longWordClass: css.longWord,
          })}
        </p>
        <label>Number hours: </label>
        <p className={css.description}>
          {richText(generalService.data.numberHour, {
            longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS_IN_DESCRIPTION,
            longWordClass: css.longWord,
          })}
        </p>
      </div>

    </div>
  );
};

export default SectionGeneral;
