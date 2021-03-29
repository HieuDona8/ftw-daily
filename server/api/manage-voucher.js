const { getSdk, handleError, createSharetribeUUID, rollbackVoucher } = require('../api-util/sdk');

module.exports = (req, res) => {
  const { transactionId } = req.body;
  transactionUUID = createSharetribeUUID(transactionId);
  const sdk = getSdk(req, res);
  sdk.transactions.show({
    id: transactionUUID
  }).then(transactionRespon => {
    const {redeemId} = transactionRespon.data.data.attributes.protectedData || {};
    rollbackVoucher(redeemId);
  }).catch(e => {
    handleError(res, e);
  });
 
};
