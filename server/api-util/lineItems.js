const { calculateQuantityFromDates, calculateTotalFromLineItems, calculateTotalFromItemVoucher } = require('./lineItemHelpers');
const { types } = require('sharetribe-flex-sdk');
const { Money } = types;
const { integrationSdk } = require('../api-util/sdk');

// This bookingUnitType needs to be one of the following:
// line-item/night, line-item/day or line-item/units
const bookingUnitType = 'line-item/night';
const PROVIDER_COMMISSION_PERCENTAGE = -25;

/** Returns collection of lineItems (max 50)
 *
 * Each line items has following fields:
 * - `code`: string, mandatory, indentifies line item type (e.g. \"line-item/cleaning-fee\"), maximum length 64 characters.
 * - `unitPrice`: money, mandatory
 * - `lineTotal`: money
 * - `quantity`: number
 * - `percentage`: number (e.g. 15.5 for 15.5%)
 * - `seats`: number
 * - `units`: number
 * - `includeFor`: array containing strings \"customer\" or \"provider\", default [\":customer\"  \":provider\" ]
 *
 * Line item must have either `quantity` or `percentage` or both `seats` and `units`.
 *
 * `includeFor` defines commissions. Customer commission is added by defining `includeFor` array `["customer"]` and provider commission by `["provider"]`.
 *
 * @param {Object} listing
 * @param {Object} bookingData
 * @returns {Array} lineItems
 */
exports.transactionLineItems = (listing, bookingData, isFirstBooking, voucherDetail = null) => {
  const unitPrice = listing.attributes.price;
  const { startDate, endDate } = bookingData;

  //caculator commission customer
  const CUSTOMER_COMMISSION_PERCENTAGE = isFirstBooking ? 15 : 55;
  const {type, percent_off} = voucherDetail && (voucherDetail.voucher ? voucherDetail.voucher.discount : voucherDetail.discount) || {};
  /**
   * If you want to use pre-defined component and translations for printing the lineItems base price for booking,
   * you should use one of the codes:
   * line-item/night, line-item/day or line-item/units (translated to persons).
   *
   * Pre-definded commission components expects line item code to be one of the following:
   * 'line-item/provider-commission', 'line-item/customer-commission'
   *
   * By default BookingBreakdown prints line items inside LineItemUnknownItemsMaybe if the lineItem code is not recognized. */

  const booking = {
    code: bookingUnitType,
    unitPrice,
    quantity: calculateQuantityFromDates(startDate, endDate, bookingUnitType),
    includeFor: ['customer', 'provider'],
  };

  const providerCommission = {
    code: 'line-item/provider-commission',
    unitPrice: calculateTotalFromLineItems([booking]),
    percentage: PROVIDER_COMMISSION_PERCENTAGE,
    includeFor: ['provider'],
  };

  const customerCommission = {
    code: 'line-item/customer-commission',
    unitPrice: calculateTotalFromLineItems([booking]),
    percentage: CUSTOMER_COMMISSION_PERCENTAGE,
    includeFor: ['customer'],
    isFirstBooking
  }

  const customerVoucher = voucherDetail && {
    code: 'line-item/customer-voucher',
    ...calculateTotalFromItemVoucher(booking, providerCommission, customerCommission, percent_off),
    quantity: 1,
    includeFor: ['customer'],
  }

  const lineItems = voucherDetail ? 
    [booking, providerCommission, customerCommission, customerVoucher]: 
    [booking, providerCommission, customerCommission];

  return lineItems;
};
