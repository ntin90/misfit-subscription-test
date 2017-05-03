/**
 * Created by hungtran on 11/21/16.
 */

var passport = require('passport');
var request = require('request-promise-native');
var moment = require('moment');

module.exports = {

  index: function (req, res) {
    res.view();
  },
  logout: function (req, res) {
    delete req.session.me;
    delete req.session.authenticated;
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
    let code = req.param('code');
    console.log("exchange token");
    let requestOption = {
      uri: 'https://openapi-portfolio-int.linkplatforms.com/oauth2/token',
      method: 'POST',
      form: {
        grant_type: 'authorization_code',
        redirect_uri: sails.config.self_host + '/auth/callback',
        client_id: sails.config.app_key,
        client_secret: sails.config.app_secret,
        code: code
      },
      json: true
    };

    request(requestOption)
      .then(function (body) {
        let accessToken = body.access_token;
        let token_type = body.token_type;
          return RequestService.getUserByToken(accessToken)
      })
      .then(function(userInfo){
        console.log(userInfo);
        req.session.me = userInfo.uid;
        req.session.authenticated = true;
        return User.upsert({uid: userInfo.uid}, userInfo);
      })
      .then(function (user) {
        let endDate = moment().format('YYYY-MM-DD');
        let startDate = moment().subtract(20, 'days').format('YYYY-MM-DD');
        console.log('aaaa',startDate, endDate);
        return RequestService.getMultipleFitness(user.uid, startDate, endDate);
      })
      .then(function (records) {
        let  promises = records.map((item) => Fitness.upsert({uid: item.uid, date: item.date}, item));
        return Promise.all(promises);
      })
      .then(function (fitnesses){
        res.redirect('/');
      })
      .catch(
        function (err) {
          res.json(502, {
            error: err
          })
        });
  }
};
