const { getSdk, handleError, createSharetribeUUID, rollbackVoucher } = require('../api-util/sdk');

module.exports = (req, res) => {
  const { transactionId } = req.body;
  transactionUUID = createSharetribeUUID(transactionId);
  const sdk = getSdk(req, res);
  sdk.transactions.show({
    id: transactionUUID
  }).then(transactionRespon => {
    const {redeemId} = transactionRespon.data.data.attributes.protectedData || {};
    const {lastTransition} = transactionRespon.data.data.attributes || {};
    if([
      'transition/decline',
      'transition/provider-cancel-refund',
      'transition/customer-cancel-refund',
      'transition/provider-cancel-refund-after-48H',
      'transition/customer-cancel-non-refund'
    ].includes(lastTransition)) {
      rollbackVoucher(redeemId);
    }
  }).catch(e => {
    handleError(res, e);
  });
 
};
