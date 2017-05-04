var request = require('request-promise-native');

module.exports = {
  apiEndPoint: {
    user: 'https://openapi-portfolio-int.linkplatforms.com/v1/user/me',
    fitness: 'https://openapi-portfolio-int.linkplatforms.com/v1/fitness/summaries/date'
  },

  // Send a GET request to server
  getData: function (url, token) {
    let options = {
      uri: url,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      json: true // Automatically parses the JSON string in the response
    };
    return request(options)
  },

  // Get user by token
  getUserByToken: function(token){
    return this.getData(this.apiEndPoint.user, token)
      .then(function (body) {
        let userInfo = ResponseParser.parseUserInfo(body);
        userInfo['last_token'] = token;
        return Promise.resolve(userInfo);
      });
  },

  // Get user by uid
  getUserData: function(uid){
    return User.getToken(uid)
    // Get user token
      .then(function (token) {
        return RequestService.getUserByToken(token);
      })
  },

  // Get fitness daily summary by date
  getFitnessByDate: function(uid, date){
    let url = `${this.apiEndPoint.fitness}/${date}`;
    return this.getFitness(uid, url);
  },

  // Get fitness daily summary by url
  getFitness: function(uid, url){
    return User.getToken(uid)
    // Get user's fitness info
      .then(function (token) {
        console.log('token', token);
        return RequestService.getData(url, token);
      })
      // Update fitness info in db
      .then(function (body) {
        sails.log.info("Pull fitness of user " + body.owner + ". Body: " + JSON.stringify(body));
        let fitness = ResponseParser.parseFitnessResponse(body);
        sails.log.info('fitness ', fitness)

        return Promise.resolve(fitness)
      });
  },

  // Get fitness daily summary in a date range
  getMultipleFitness: function (uid, startDate, endDate) {
    let url = `${this.apiEndPoint.fitness}?startDate=${startDate}&endDate=${endDate}`;
    return User.getToken(uid)
    // Get user's fitness info
      .then(function (token) {
        console.log('token', token);
        console.log('url', url);
        return RequestService.getData(url, token);
      })
      // Update fitness info in db
      .then(function (result) {
        console.log('b');
        //let fitness = ResponseParser.parseFitnessResponse(body);
        //sails.log.info('fitness ', fitness)
        let parsedResult = result.map((item) => ResponseParser.parseFitnessResponse(item))
        console.log('c');

        return Promise.resolve(parsedResult)
      });

  }
};

// Parse response to internal object
const ResponseParser = {

    parseFitnessResponse: function (body) {
      return {
        uid: body.owner,
        date: body.date,
        goalSteps: body.goalSteps,
        totalDistance: body.totalDistance,
        totalCalories: body.totalCalories,
        totalSteps: body.totalSteps,
        totalActivities: body.totalActivities,
        totalIntensityDistInStep: body.totalIntensityDistInStep,
        reachGoal: body.reachGoal
      }
    },

    parseUserInfo: function (body) {
      let userInfo = {
        uid: body.objectId,
        username: body.username,
        first_name: body.firstName,
        last_name: body.lastName,
        weight: body.weightInGrams,
        height: body.heightInCentimeters,
        profile_picture: body.profilePicture,
        birth_day: body.birth_day,
        gender: body.gender,
        email: body.email,
        changed: false,
        created_at: body.createdAt,
        updated_at: body.updatedAt
      };
      return userInfo;
    }

}
