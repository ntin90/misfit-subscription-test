var passport = require('passport');
var request = require('request-promise-native');


module.exports = {
  pullUser: function (req, res) {
    let uid = req.session.me;
    RequestService.getUserData(uid)
      .then(function (user) {
        return User.upsert(uid, user);
      })
      .then(function (record) {
        res.json(200, {
          record: record
        })
      })
      .catch(function (err) {
        res.json(502, {
          error: err
        })
      })
  },

  pullFitness: function (req, res) {
    let date = req.param('date');
    let uid = req.session.me;

    RequestService.getFitnessByDate(uid, date)
      .then(function (fitness) {
        return Fitness.upsert({uid: uid, date: date}, fitness);
      })
      .then(function (record) {
        res.json(200, {
          record: record
        })
      })
      .catch(function (err) {
        res.json(502, {
          error: err
        })
      });
  },

  pullMultipleFitness: function (req, res) {
    let startDate = req.param('startDate');
    let endDate = req.param('endDate');
    let uid = req.session.me;
    RequestService.getMultipleFitness(uid, startDate, endDate)
      .then(function (records) {
        // Multiple upsert - sequentially
        let promises = records.map((item) => Fitness.upsert({uid: uid, date: item.date}, item));
        return Promise.all(promises);
      })
      .then(function (records) {
        res.json(200, {
          records: records
        })
      })
      .catch(function (err) {
        res.json(502, {
          error: err
        })
      });
  },

  // Subscribe to receive new user's data update
  subscribe: function (req, res) {
    if (!req.isSocket) {
      return res.badRequest();
    }
    let uid = req.session.me;
    sails.sockets.join(req, uid, function (err) {
      if (err) {
        sails.log.error(err);
        return res.serverError(err);
      }

      sails.log.info('Subscribed to a room called ' + uid + '!');
      return res.json({
        message: 'Subscribed to a room called ' + uid + '!'
      });
    });
  }
};
