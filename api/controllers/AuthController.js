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
        res.clearCookie('AT');
        res.clearCookie('UID');
        res.redirect('/');
    },
    misfit: function (req, res) {
        var url = 'https://openapi-portfolio-int.linkplatforms.com/oauth2/authorization?';
        url += 'response_type=code&';
        url += 'client_id=' + sails.config.app_key + '&';
        url += 'scope=email&';
        url += 'redirect_uri=' + sails.config.self_host + '/auth/callback';
        res.redirect(url);
    },
    callback: function (req, res) {

        var code = req.param('code');
        console.log("exchange token");

        request.post('https://openapi-portfolio-int.linkplatforms.com/oauth2/token',
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
                    res.cookie("AT", body.access_token);
                    request.get('https://openapi-portfolio-int.linkplatforms.com/v1/user/me',
                      { 'auth': {'bearer': body.access_token}, 'json': true},
                      function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                          res.cookie('UID', body.objectId);
                          res.redirect('/');
                        } else {
                          sails.log.error('Cannot get UID');
                          res.redirect('/');
                        }
                      }
                    );

                } else {
                    console.log(error, body);
                    res.redirect('/');
                }
            }
        );

    }
};
