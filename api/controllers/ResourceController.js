var passport = require('passport');
var request = require('request');


module.exports = {
  pullUser: function (req, res) {
    var token = req.cookies['AT'];
    console.log(token);
    request.get('https://openapi-portfolio-int.linkplatforms.com/v1/user/me',
      {'auth': {'bearer': token}, 'json': true},
      function (error, response, body) {
        console.log(body);
        if (!error && response.statusCode == 200) {
          var uid = body.objectId;
          User.update({uid: uid}, {
            first_name: body.firstName,
            last_name: body.lastName,
            weight: body.weight,
            height: body.height,
            changed: false
          }).exec(function (err, updated) {
            if (err) {
              res.json(502, {
                error: err
              })
            } else {
              if (updated.length == 0) {
                User.create({
                  uid: uid,
                  first_name: body.firstName,
                  last_name: body.lastName,
                  weight: body.weightInGrams,
                  height: body.heightInCentimeters,
                  changed: false
                }).exec(function (err) {
                  if (err) {
                    res.json(502, {
                      error: err
                    })
                  }
                });
              }
              res.redirect('/');
            }
          })
        } else {
          res.json(502, {
            error: error,
            body: body
          });
        }
      }
    );
  },

  pullFitness: function (req, res)  {
      var date = req.param('date');
      var token = req.cookies['AT'];
      console.log(token);
      request.get('https://openapi-portfolio-int.linkplatforms.com/v1/fitness/summaries/date/'+date,
        { 'qs': { 'beginDate': date, 'endDate': date}, 'auth': { 'bearer': token}, 'json': true},
        function (error, response, body) {
          console.log(body);
          if (!error && response.statusCode == 200) {
            var uid = body.owner;
            Fitness.update({uid: uid, date: date}, {
              steps: body.totalSteps,
              changed: false
            }).exec(function (err, updated) {
              if (err) {
                console.log(err);
                return res.json(502, {
                  error: err
                })
              } else {
                if (updated.length==0) {
                  if (body.objectId) {
                    Fitness.create({
                      uid: uid,
                      date: date,
                      id: body.objectId,
                      steps: body.totalSteps,
                      changed: false
                    }).exec(function (err) {
                      if (err) {
                        console.log(err);
                        return res.json(502, {
                          error: err
                        })
                      }
                    });
                  }
                }
                return res.redirect('/');
              }
            })
          } else {
            console.log(error);
            return res.json(502, {
              error: error,
              body: body
            });
          }
        }
      );

    // res.redirect('/resource/show');
  }
};
