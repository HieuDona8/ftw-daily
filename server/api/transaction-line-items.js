const { transactionLineItems } = require('../api-util/lineItems');
const { getSdk, handleError, serialize, integrationSdk, createUUID } = require('../api-util/sdk');
const { constructValidLineItems } = require('../api-util/lineItemHelpers');

module.exports = (req, res) => {
  const { isOwnListing, listingId, bookingData, currentUserID } = req.body;
  const sdk = getSdk(req, res);

  const listingPromise = isOwnListing
    ? sdk.ownListings.show({ id: listingId })
    : sdk.listings.show({ id: listingId });
  const uuid = createUUID(currentUserID);

  Promise.all([listingPromise, integrationSdk.transactions.query({customerId: uuid})])
    .then(apiResponse => {
      const listing = apiResponse[0].data.data;
      const isFirstBooking = apiResponse[1].data.meta.totalItems <= 0;
      const lineItems = transactionLineItems(listing, bookingData, isFirstBooking);
      // Because we are using returned lineItems directly in FTW we need to use the helper function
      // to add some attributes like lineTotal and reversal that Marketplace API also adds to the response.
      const validLineItems = constructValidLineItems(lineItems);

      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(serialize({ data: validLineItems }))
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
