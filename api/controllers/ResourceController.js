var passport = require('passport');
var request = require('request-promise-native');


module.exports = {
  pullUser: function (req, res) {
    let uid = req.session.me;
    RequestService.getUserData(uid)
      .then(function (user) {
        return User.upsert(uid, user);
      })
      // Redirect to home
      .then(function (record) {
        res.json(200, {
          record: record
        })
        //res.redirect('/');
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
      })

    /*Fitness.find({uid: uid, changed: true}).exec(function (err, result) {
     result.forEach(function (e, i) {
     request.get(e.href,
     {'auth': {'bearer': token}, 'json': true},
     function (error, response, body) {
     e.totalSteps = body.totalSteps;
     e.save();
     }
     );
     });
     });*/
  },

  pullMultipleFitness: function (req, res) {
    let startDate = req.param('startDate');
    let endDate = req.param('endDate');
    let uid = req.session.me;
    RequestService.getMultipleFitness(uid, startDate, endDate)
      .then(function (records) {
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
