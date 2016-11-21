/**
 * Created by hungtran on 11/21/16.
 */

var passport = require('passport');
var request = require('request');


module.exports = {

    index: function (req, res) {
        res.view();
    },
    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },
    misfit: function (req, res) {
        var url = 'https://api.misfitwearables.com/auth/dialog/authorize?';
        url += 'response_type=code&';
        url += 'client_id=' + sails.config.app_key + '&';
        url += 'scope=email&';
        url += 'redirect_uri=' + sails.config.self_host + '/auth/callback';
        res.redirect(url);
    },
    callback: function (req, res) {

        var code = req.param('code');
        console.log("exchange token");

        request.post('https://api.misfitwearables.com/auth/tokens/exchange',
            {
                form: {
                    grant_type: 'authorization_code',
                    redirect_uri: sails.config.self_host + '/auth/callback',
                    client_id: sails.config.app_key,
                    client_secret: sails.config.app_secret,
                    code: code
                },
                json: true
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var accessToken = body.access_token;
                    var tokenType = body.token_type;

                    console.log(body);

                } else {
                    console.log(error, body)
                }
            }
        );

        res.redirect('/');
    },

    misfitEndPoint: function (req, res) {
        var type = req.body.type;
        switch (type) {
            case Constant.SNS_MESSAGE_TYPE.SUBSCRIPTION_CONFIRMATION:
                subscriptionConfirmation(req);
                break;
            case Constant.SNS_MESSAGE_TYPE.NOTIFICATION:
                break;
        }

        res.json({}, 200);
    }

};

function subscriptionConfirmation(req) {
    var subscribeURL = req.body.SubscribeURL;
    var options = {
        url: subscribeURL,
        headers: {access_token: accessToken}
    };
    request.get(options, function (err, response, body) {
            console.log(body);
        }
    );
}


function receivedNotification(req) {

    var messages = req.body.Message;
    messages.forEach(function (message) {

    });
}
