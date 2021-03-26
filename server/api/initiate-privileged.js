const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, getTrustedSdk, handleError, serialize, integrationSdk, createUUID, checkFirstBooking, redeemVoucher } = require('../api-util/sdk');

module.exports = (req, res) => {
  const { isSpeculative, bookingData, bodyParams, queryParams, currentUserID, voucherCode } = req.body;
  const listingId = bodyParams && bodyParams.params ? bodyParams.params.listingId : null;

  const sdk = getSdk(req, res);
  let lineItems = null;
  const uuid = createUUID(currentUserID);

  const arrayPromise = voucherCode ? 
    [sdk.listings.show({ id: listingId }), integrationSdk.transactions.query({customerId: uuid}), redeemVoucher(voucherCode)]:
    [sdk.listings.show({ id: listingId }), integrationSdk.transactions.query({customerId: uuid})]
  Promise.all(arrayPromise)
    .then(apiResponse => {
      const listing = apiResponse[0].data.data;
      const isFirstBooking = checkFirstBooking(apiResponse[1].data.data);
      lineItems = apiResponse[2] ? 
        transactionLineItems(listing, bookingData, isFirstBooking, apiResponse[2]): 
        transactionLineItems(listing, bookingData, isFirstBooking);
      return getTrustedSdk(req);
    })
    .then(trustedSdk => {
      const { params } = bodyParams;
      // Add lineItems to the body params
      const body = {
        ...bodyParams,
        params: {
          ...params,
          lineItems,
        },
      };

      if (isSpeculative) {
        return trustedSdk.transactions.initiateSpeculative(body, queryParams);
      }
      return trustedSdk.transactions.initiate(body, queryParams);
    })
    .then(apiResponse => {
      const { status, statusText, data } = apiResponse;
      res
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
