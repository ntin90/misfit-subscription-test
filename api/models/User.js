module.exports = {
  attributes: {
    uid: {
      type: 'string',
      required: true
    },

    username: {
      type: 'string'
    },

    first_name: {
      type: 'string'
    },

    last_name: {
      type: 'string'
    },

    profile_picture: {
      type: 'string'
    },

    birthday: {
      type: 'string'
    },

    gender: {
      type: 'string'
    },

    email: {
      type: 'string'
    },

    weight: {
      type: 'float'
    },

    height: {
      type: 'float'
    },

    last_token: {
      type: 'string'
    },

    href: {
      type: 'string'
    },

    changed: {
      type: 'boolean'
    },

    created_at: {
      type: 'datetime'
    },

    updated_at: {
      type: 'datetime'
    }
  },

  getToken: function (uid) {
    return User.findOne({uid: uid})
    // Get user info
      .then(function (user) {
        if (!user)
          return Promise.reject('User not found');
        else {
          sails.log.info("Use token :" + user.last_token);
          return Promise.resolve(user.last_token);
        }
      });
  },

  upsert: function (query, data) {
    return UpsertService.upsert(User, query, data)
  }
};
