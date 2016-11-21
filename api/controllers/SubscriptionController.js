/**
 * Created by hungtran on 11/21/16.
 */

var request = require('request');


module.exports = {
    index: function (req, res) {
        sails.log.debug(">>> Index");
    },
    endpoint: function (req, res) {
        var type = req.body.Type;
        sails.log.debug(">>> Message type:" + type);
        switch (type) {
            case Constant.SNS_MESSAGE_TYPE.SUBSCRIPTION_CONFIRMATION:
                subscriptionConfirmation(req, res);
                break;
            case Constant.SNS_MESSAGE_TYPE.NOTIFICATION:
                receivedNotification(req, res);
                break;
        }
    }
};


function subscriptionConfirmation(req, res) {
    sails.log.debug(">>> Received message successfully");

    var subscribeURL = req.body.SubscribeURL;
    var options = {
        url: subscribeURL,
        headers: {verify_token: req.body.Token}
    };

    sails.log.debug(">>> Replying to " + subscribeURL);
    request.get(options, function (err, response, body) {
            if (err) {
                return res.status(500).json(err.message);
            }

            sails.log.debug(body);
            return res.status(200).json({});
        }
    );

}


function receivedNotification(req, res) {
    var messages = req.body.Message;
    messages.forEach(function (message) {
        sails.log.debug(message);
    });

}
