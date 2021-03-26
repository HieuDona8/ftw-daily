import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { types as sdkTypes } from '../../util/sdkLoader';
import { LINE_ITEM_CUSTOMER_VOUCHER, propTypes } from '../../util/types';
import Decimal from 'decimal.js';

import css from './BookingBreakdown.module.css';

const { Money } = sdkTypes;

const LineItemCustomerVoucherMaybe = props => {
  const { transaction, isCustomer, intl } = props;
  const customerVoucherLineItem = transaction.attributes.lineItems.find(
    item => item.code === LINE_ITEM_CUSTOMER_VOUCHER && !item.reversal
  );
  let commissionItem = null;

  if (isCustomer && customerVoucherLineItem) {
    const commission = customerVoucherLineItem.lineTotal;
    const formattedCommission = commission ? formatMoney(intl, commission) : null;
    const formartUnitPrice = formatMoney(intl, customerVoucherLineItem.unitPrice);

    commissionItem = (
      <div className={css.lineItem}>
        <span className={css.itemLabel}>
          <FormattedMessage 
            id="BookingBreakdown.voucher" 
            values={
                {
                    percent: customerVoucherLineItem.percentage.toNumber(),
                    price: formartUnitPrice
                }
            }
          />
        </span>
        <span className={css.itemValue}>{formattedCommission}</span>
      </div>
    );
  }

  return commissionItem;
};

LineItemCustomerVoucherMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  isCustomer: bool.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemCustomerVoucherMaybe;
