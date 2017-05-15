var request = require('request-promise-native');

module.exports = {
  apiEndPoint: {
    user: 'https://openapi-portfolio-int.linkplatforms.com/v1/user/me',
    fitness: 'https://openapi-portfolio-int.linkplatforms.com/v1/fitness/summaries/date',
    night: 'https://openapi-portfolio-int.linkplatforms.com/v1/night/sleep/summaries/date',
    device: 'https://openapi-portfolio-int.linkplatforms.com/v1/device/watches'

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
  getUserByToken: function (token) {
    return this.getData(this.apiEndPoint.user, token)
      .then(function (body) {
        let userInfo = ResponseParser.parseUserInfo(body);
        userInfo['last_token'] = token;
        return Promise.resolve(userInfo);
      });
  },

  // Get user by uid
  getUserData: function (uid) {
    return User.getToken(uid)
    // Get user token
      .then(function (token) {
        return RequestService.getUserByToken(token);
      })
  },

  // Get fitness daily summary by date
  getFitnessByDate: function (uid, date) {
    let url = `${this.apiEndPoint.fitness}/${date}`;
    return this.getFitness(uid, url);
  },

  // Get fitness daily summary by url
  getFitness: function (uid, url) {
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
        sails.log.info('fitness ', fitness);

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
        //let fitness = ResponseParser.parseFitnessResponse(body);
        //sails.log.info('fitness ', fitness)
        let parsedResult = result.map((item) => ResponseParser.parseFitnessResponse(item))
        return Promise.resolve(parsedResult)
      });
  },

  // Get sleep daily summary by date
  getSleepByDate: function (uid, date) {
    let url = `${this.apiEndPoint.night}/${date}`;
    return this.getSleep(uid, url);
  },

  // Get sleep daily summary by url
  getSleep: function (uid, url) {
    return User.getToken(uid)
    // Get user's fitness info
      .then(function (token) {
        console.log('token', token);
        return RequestService.getData(url, token);
      })
      // Update fitness info in db
      .then(function (body) {
        sails.log.info("Pull sleep of user " + body.owner + ". Body: " + JSON.stringify(body));
        let sleep = ResponseParser.parseSleepResponse(body);
        sails.log.info('fitness ', sleep);

        return Promise.resolve(sleep)
      });
  },

  // Get sleep daily summary in a date range
  getMultipleSleep: function (uid, startDate, endDate) {
    let url = `${this.apiEndPoint.night}?beginDate=${startDate}&endDate=${endDate}`;
    return User.getToken(uid)
    // Get user's fitness info
      .then(function (token) {
        console.log('token', token);
        console.log('url', url);
        return RequestService.getData(url, token);
      })
      // Update fitness info in db
      .then(function (result) {
        console.log(result);
        let parsedResult = result['items'].map((item) => ResponseParser.parseSleepResponse(item));
        console.log(parsedResult);
        return Promise.resolve(parsedResult)
      });
  },

  // Get sleep daily summary by date
  getDeviceById: function (uid, id) {
    let url = `${this.apiEndPoint.device}/${id}`;
    return this.getFitness(uid, url);
  },

  // Get sleep daily summary by url
  getDevice: function (uid, url) {
    return User.getToken(uid)
    // Get user's fitness info
      .then(function (token) {
        console.log('token', token);
        return RequestService.getData(url, token);
      })
      // Update fitness info in db
      .then(function (body) {
        sails.log.info("Pull device of user " + body.owner + ". Body: " + JSON.stringify(body));
        let device = ResponseParser.parseDeviceInfo(body);
        sails.log.info('device ', device);

        return Promise.resolve(device)
      });
  },

  // Get sleep daily summary in a date range
  getMultipleDevice: function (uid) {
    let url = `${this.apiEndPoint.device}`;
    return User.getToken(uid)
    // Get user's fitness info
      .then(function (token) {
        console.log('token', token);
        console.log('url', url);
        return RequestService.getData(url, token);
      })
      // Update fitness info in db
      .then(function (result) {
        console.log(result);
        let parsedResult = result['items'].map((item) => ResponseParser.parseDeviceInfo(item));

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
      goal_steps: body.goalSteps,
      total_distance: body.totalDistance,
      total_calories: body.totalCalories,
      total_steps: body.totalSteps,
      total_activities: body.totalActivities,
      total_intensity_dist_in_step: body.totalIntensityDistInStep,
      reach_goal: body.reachGoal
    }
  },

  parseSleepResponse: function (body) {
    return {
      uid: body.owner,
      date: body.date,
      total_sleep_minutes: body.totalSleepMinutes,
      total_sleeps: body.totalSleeps,
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
  },


  parseDeviceInfo: function (body) {
    let userInfo = {
      uid: body.owner,
      device_id: body.username,
      device_type: body.firstName,
      production_display_name: body.lastName,
      sku: body.weightInGrams,
      manufacturer: body.heightInCentimeters,
      created_at: body.createdAt,
      updated_at: body.updatedAt
    };
    return userInfo;
  }
}
