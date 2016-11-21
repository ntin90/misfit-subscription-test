/**
 * Created by hungtran on 11/21/16.
 */

module.exports = {
    endpoint: function (req, res) {
        var type = req.body.type;
        switch (type) {
            case Constant.SNS_MESSAGE_TYPE.SUBSCRIPTION_CONFIRMATION:
                subscriptionConfirmation(req);
                break;
            case Constant.SNS_MESSAGE_TYPE.NOTIFICATION:
                break;
        }
        res.status(200).json({});
    }
};


function subscriptionConfirmation(req) {
    var subscribeURL = req.body.SubscribeURL;
    var options = {
        url: subscribeURL,
        headers: {access_token: accessToken}
    };
    console.log(">>> Received message successfully");
    request.get(options, function (err, response, body) {
            console.log(body);
        }
    );
}


function receivedNotification(req) {
    var messages = req.body.Message;
    messages.forEach(function (message) {
        console.log(message);
    });
}
