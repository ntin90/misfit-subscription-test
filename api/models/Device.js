module.exports = {
  attributes: {
    uid: {
      type: 'string',
      required: true
    },
    device_id: {
      type: 'string',
      required: true
    },

    device_type: {
      type: 'string'
    },

    production_display_name: {
      type: 'string'
    },

    sku: {
      type: 'string'
    },

    manufacturer: {
      type: 'string'
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
