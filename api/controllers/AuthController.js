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
    }
};
