/**
 * Created by hungtran on 11/21/16.
 */

var request = require('request');


module.exports = {
    index: function (req, res) {
        sails.log.info(">>> Index");
    },
    endpoint: function (req, res) {
        var type = req.body.Type;
        sails.log.info(">>> Message type:" + type);
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
    sails.log.info(">>> Received message successfully");

    var subscribeURL = req.body.SubscribeURL;
    var options = {
        url: subscribeURL,
        headers: {verify_token: req.body.Token}
    };

    sails.log.info(">>> Replying to " + subscribeURL);
    request.get(options, function (err, response, body) {
            if (err) {
                return res.status(500).json(err.message);
            }

            sails.log.info(body);
            return res.status(200).json({});
        }
    );

}

function receivedNotification(req, res) {
  sails.log.info(req.body);
  var mess = req.body.Message;
  var type = mess.type;
  var ownerId = mess.ownerId;
  var id = mess.id;
  var action = mess.action;
  var at = mess.at;

  switch(type) {
    case "user":
      User.update({uid: id}, {changed: true}).exec(function(err, u) {
        if (err) { sails.log.error(err); }
        if (u.length==0) {
          User.create({uid: id, changed: true}).exec(function(err) {
            if (err) { sails.log.error(err); }
          })
        }
      });
      break;
    case "activity_day_summary":
    Fitness.update({uid: ownerId, id: id}, {changed: true}).exec(function(err, u) {
      if (err) { sails.log.error(err); }
      if (u.length==0) {
        Fitness.create({uid: id, id: id, changed: true}).exec(function(err) {
        if (err) { sails.log.error(err); }
        });
      }
      });
      break;
    default:
      break;
  }

  return res.status(200).json({});
}
