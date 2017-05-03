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
  let mess = JSON.parse(req.body.Message);
  let type = mess.type;
  let uid = mess.ownerId;
  let id = mess.id;
  let action = mess.action;
  let at = mess.at;
  let href = mess.href;

  switch (type) {
    case "user":
      RequestService.getUserData(uid)
        .then(function (userInfo) {
          User.upsert({uid: uid}, userInfo);
          sails.log.info('BROADCAST to ' + uid);
          sails.sockets.broadcast(uid, 'user', userInfo)
        });
      break;
    case "activity_day_summary":
      RequestService.getFitness(uid, href)
        .then(function (fitnessInfo) {
          Fitness.upsert({uid: uid, date: fitnessInfo.date}, fitnessInfo);
          sails.log.info('BROADCAST to ' + uid);
          sails.sockets.broadcast(uid, 'activity_day_summary', fitnessInfo)
        });
      break;
    default:
      break;
  }

  return res.status(200).json({});
}
