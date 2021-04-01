const schedule = require('node-schedule');
const { integrationSdk, rollbackVoucher } = require('./api-util/sdk');
const moment = require('moment');

const timeRequest = moment().subtract('hours', 2).toDate();
const checkRollback = () => {
    integrationSdk.events.query({
        createdAtStart: timeRequest,
        eventTypes: 'transaction/transitioned'
    }).then(response => {
        response.data.data.forEach(item => {
            const {lastTransition, protectedData } = item.attributes.resource.attributes;
            if(lastTransition === 'transaction/expire-payment' || lastTransition === 'transition/expire') {
                const {redeemId} = protectedData;
                rollbackVoucher(redeemId);
            }
        })
    })
}

schedule.scheduleJob('* * */2 * * *', checkRollback);
