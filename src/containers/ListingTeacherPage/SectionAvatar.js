import React from 'react';
import { NamedLink, AvatarLarge, AvatarMedium } from '../../components';

import css from './ListingTeacherPage.module.css';

const SectionAvatar = props => {
  const { user, params } = props;
  return (
    <div className={css.sectionAvatar}>
      <NamedLink name="ListingTeacherPage" params={params} to={{ hash: '#host' }}>
        <AvatarLarge user={user} className={css.avatarDesktop} disableProfileLink />
      </NamedLink>
      <NamedLink name="ListingTeacherPage" params={params} to={{ hash: '#host' }}>
        <AvatarMedium user={user} className={css.avatarMobile} disableProfileLink />
      </NamedLink>
    </div>
  );
};

export default SectionAvatar;